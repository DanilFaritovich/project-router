import { test, expect, type Page } from '@playwright/test'
import { loadEnv } from 'vite'
import { messages, type Locale } from '../../src/locales'

const originValue = loadEnv(
  'production',
  process.cwd(),
  'VITE_',
).VITE_SITE_ORIGIN
const origin = originValue?.trim()
  ? new URL(originValue.trim()).origin
  : undefined

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
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(
    origin ? 1 : 0,
  )
  await expect(page.locator('link[hreflang]')).toHaveCount(origin ? 3 : 0)
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(
    origin ? 1 : 0,
  )
  if (origin) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}/${locale}/`,
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${origin}/${locale}/`,
    )
    for (const [language, path] of Object.entries({
      en: '/en/',
      ru: '/ru/',
      'x-default': '/en/',
    })) {
      const link = page.locator(`link[hreflang="${language}"]`)
      await expect(link).toHaveCount(1)
      await expect(link).toHaveAttribute('rel', 'alternate')
      await expect(link).toHaveAttribute('href', `${origin}${path}`)
    }
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
    await page.goto(`/${locale}/?utm_source=seo#skills`)
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
  await expect(page).toHaveURL(/\/en\//)
  await expectMetadata(page, 'en')
  await page
    .getByRole('link', { name: 'Русский' })
    .filter({ visible: true })
    .click()
  await expectMetadata(page, 'ru')
  await page.goBack()
  await expectMetadata(page, 'en')
  await page.goForward()
  await expectMetadata(page, 'ru')
  await page.goto('/')
  await expectMetadata(page, 'en')
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
