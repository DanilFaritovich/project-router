import { test, expect } from '@playwright/test'

test('production direct entry, refresh, language switching and root redirect', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error')
      errors.push(message.text())
  })
  for (const locale of ['en', 'ru']) {
    await page.goto(`/${locale}/`)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? 'Danil Miftakhov' : 'Данил Мифтахов',
    )
  }
  await page
    .getByRole('link', { name: 'English' })
    .filter({ visible: true })
    .click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page).toHaveTitle(/Engineering portfolio/)
  await page.goto('/')
  await expect(page).toHaveURL(/\/en\/$/)
  expect(errors).toEqual([])
})

test('Russian production HTML works with JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  })
  const page = await context.newPage()
  await page.goto('/ru/')
  await expect(page.locator('main')).toContainText('Данил Мифтахов')
  await page
    .getByRole('link', { name: 'English' })
    .filter({ visible: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await context.close()
})
