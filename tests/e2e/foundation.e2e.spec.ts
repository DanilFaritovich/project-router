import { test, expect, type Page } from '@playwright/test'
import { messages, type Locale } from '../../src/locales'

async function expectMetadata(page: Page, locale: Locale) {
  const copy = messages[locale]
  await expect(page.locator('html')).toHaveAttribute('lang', locale)
  await expect(page.locator('title')).toHaveCount(1)
  await expect(page).toHaveTitle(copy.title)
  for (const [selector, content] of [
    ['meta[name="description"]', copy.description],
    ['meta[property="og:title"]', copy.title],
    ['meta[property="og:description"]', copy.description],
    ['meta[property="og:type"]', 'website'],
    ['meta[property="og:locale"]', locale === 'en' ? 'en_US' : 'ru_RU'],
    [
      'meta[property="og:locale:alternate"]',
      locale === 'en' ? 'ru_RU' : 'en_US',
    ],
  ]) {
    await expect(page.locator(selector)).toHaveCount(1)
    await expect(page.locator(selector)).toHaveAttribute('content', content)
  }
}

test('production direct entry, refresh, language switching and root redirect', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error')
      errors.push(message.text())
  })
  for (const locale of ['en', 'ru'] as const) {
    await page.goto(`/${locale}/`)
    await page.reload()
    await expectMetadata(page, locale)
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? 'Danil Miftakhov' : 'Данил Мифтахов',
    )
  }
  await page
    .getByRole('link', { name: 'English' })
    .filter({ visible: true })
    .click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expectMetadata(page, 'en')
  await page
    .getByRole('link', { name: 'Русский' })
    .filter({ visible: true })
    .click()
  await expectMetadata(page, 'ru')
  await page.goBack()
  await expectMetadata(page, 'en')
  await page.goto('/')
  await expect(page).toHaveURL(/\/en\/$/)
  expect(errors).toEqual([])
})

test('localized production metadata works with JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  })
  const page = await context.newPage()
  await page.goto('/ru/')
  await expectMetadata(page, 'ru')
  await expect(page.locator('main')).toContainText('Данил Мифтахов')
  await page
    .getByRole('link', { name: 'English' })
    .filter({ visible: true })
    .click()
  await expectMetadata(page, 'en')
  await context.close()
})
