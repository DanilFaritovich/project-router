import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`late PDF responses cannot reopen or replace the selected document at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    const pdfRequests: string[] = []
    page.on('request', (request) => pdfRequests.push(request.url()))
    await page.goto('/en/#resume')
    expect(
      pdfRequests.some((url) =>
        /pdf(?:\.worker)?[-.].*\.(?:js|mjs)$/.test(url),
      ),
    ).toBe(false)
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    let received!: () => void
    const arrived = new Promise<void>((resolve) => {
      received = resolve
    })
    await page.route('**/resumes/backend-en.pdf', async (route) => {
      received()
      await gate
      await route.continue().catch(() => {})
    })
    const opener = page.locator('#resume article').first().getByRole('button')
    await opener.click()
    await arrived
    const dialog = page.getByRole('dialog')
    await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()
    release()
    await page.unroute('**/resumes/backend-en.pdf')
    await opener.click()
    await expect(dialog.locator('canvas')).toBeVisible()
    let releaseRussian!: () => void
    const russianGate = new Promise<void>((resolve) => {
      releaseRussian = resolve
    })
    let russianReceived!: () => void
    const russianArrived = new Promise<void>((resolve) => {
      russianReceived = resolve
    })
    await page.route('**/resumes/backend-ru.pdf', async (route) => {
      russianReceived()
      await russianGate
      await route.continue().catch(() => {})
    })
    await dialog.getByRole('button', { name: 'RU', exact: true }).click()
    await russianArrived
    await dialog.getByRole('button', { name: 'EN', exact: true }).click()
    releaseRussian()
    await expect(dialog.locator('canvas')).toBeVisible()
    await expect(dialog.locator('canvas')).toHaveAttribute('lang', 'en')
    await expect(dialog.locator('a[download]')).toHaveAttribute(
      'href',
      '/resumes/backend-en.pdf',
    )
    await expect(
      dialog.locator('.pdf-annotations a[href*="github"]'),
    ).not.toHaveCount(0)
    for (const resizeWidth of [320, 1024, width]) {
      await page.setViewportSize({ width: resizeWidth, height: 900 })
      await dialog.getByRole('button', { name: 'Fit width' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      expect(
        await dialog
          .locator('.pdf-viewport')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(opener).toBeFocused()
    expect(await page.locator('body').evaluate((el) => el.style.overflow)).toBe(
      '',
    )
    expect(errors).toEqual([])
  })
}

test('repeated mobile menu actions restore focus, inertness and scrolling across resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 615 })
  await page.goto('/ru/?source=race#projects')
  const trigger = page.locator('.menu-trigger')
  for (let cycle = 0; cycle < 5; cycle++) {
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('button')).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(dialog.locator('a[lang="ru"]')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#main')).toHaveJSProperty('inert', false)
  }
  await trigger.click()
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await page.locator('body').evaluate((el) => el.style.overflow)).toBe(
    '',
  )
  await expect(page.locator('#main')).toHaveJSProperty('inert', false)
  await page.setViewportSize({ width: 320, height: 615 })
  await trigger.click()
  await page.getByRole('dialog').locator('a[href$="#contacts"]').click()
  await expect(page.locator('#contacts-heading')).toBeFocused()
  await expect(page).toHaveURL('/ru/?source=race#contacts')
})
