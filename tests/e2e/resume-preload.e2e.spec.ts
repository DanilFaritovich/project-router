import { expect, test } from '@playwright/test'

test('prepares current-language PDFs and reuses them for repeated previews', async ({
  page,
}) => {
  const requests: string[] = []
  page.on('request', (request) => {
    if (/\/resumes\/.*\.pdf$/.test(request.url()))
      requests.push(new URL(request.url()).pathname)
  })
  await page.goto('/en/')
  await expect.poll(() => requests.length).toBe(3)
  expect(requests).toEqual([
    '/resumes/candidate-backend-en.pdf',
    '/resumes/candidate-ai-en.pdf',
    '/resumes/candidate-data-en.pdf',
  ])
  await expect(page.getByRole('dialog')).toHaveCount(0)
  // No canvas or document worker is created by speculative preparation.
  expect(page.workers()).toHaveLength(0)
  const button = page.locator('#resume article').first().getByRole('button')
  for (let index = 0; index < 2; index++) {
    await button.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
      'aria-busy',
      'false',
    )
    await expect(dialog.locator('canvas')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  }
  expect(requests).toHaveLength(3)
  await page.locator('.desktop-rail a[hreflang="ru"]').click()
  await expect
    .poll(() => requests.filter((url) => url.endsWith('-ru.pdf')).length)
    .toBe(3)
  await page.locator('#resume article').first().getByRole('button').click()
  await expect(page.getByRole('dialog').locator('canvas')).toHaveAttribute(
    'lang',
    'ru',
  )
  await expect(page.getByRole('dialog').locator('[aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  )
  expect(requests).toHaveLength(6)
})

test('keeps PDF preparation off the services page', async ({ page }) => {
  const resources: string[] = []
  page.on('request', (request) => {
    if (/\/resumes\/|pdf\.worker|\/pdf-/.test(request.url()))
      resources.push(request.url())
  })
  await page.goto('/en/freelance/')
  await page.waitForTimeout(2500)
  expect(resources).toEqual([])
})

test('defers speculative traffic with Save-Data but supports keyboard preview', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
    })
  })
  const requests: string[] = []
  page.on('request', (request) => {
    if (/\/resumes\/.*\.pdf$/.test(request.url())) requests.push(request.url())
  })
  await page.goto('/en/')
  await page.waitForTimeout(2500)
  expect(requests).toEqual([])
  const button = page.locator('#resume article').first().getByRole('button')
  await button.focus()
  await expect.poll(() => requests.length).toBe(1)
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog').locator('[aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  )
  expect(requests).toHaveLength(1)
})

test('a click during background fetching shares the request and renders the document', async ({
  page,
}) => {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  let count = 0
  await page.route('**/resumes/candidate-backend-en.pdf', async (route) => {
    count++
    await gate
    await route.continue()
  })
  await page.goto('/en/')
  await expect.poll(() => count).toBe(1)
  await page.locator('#resume article').first().getByRole('button').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  release()
  await expect(page.getByRole('dialog').locator('[aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  )
  expect(count).toBe(1)
})

test('retries a document whose successful HTTP response contained invalid PDF data', async ({
  page,
}) => {
  let invalid = true
  await page.route('**/resumes/candidate-backend-en.pdf', (route) =>
    invalid
      ? route.fulfill({ contentType: 'application/pdf', body: 'invalid PDF' })
      : route.continue(),
  )
  await page.goto('/en/')
  await page.locator('#resume article').first().getByRole('button').click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('alert')).toBeVisible()
  invalid = false
  await dialog.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  )
  await expect(dialog.locator('canvas')).toBeVisible()
})
