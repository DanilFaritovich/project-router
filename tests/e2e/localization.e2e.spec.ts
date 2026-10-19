import { test, expect } from '@playwright/test'
import { sections } from '../../src/content/portfolio'

test('direct query/hash entries and refresh hydrate both locales without losing link destinations', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (['warning', 'error'].includes(message.type()))
      errors.push(message.text())
  })
  for (const locale of ['en', 'ru']) {
    await page.goto(`/${locale}/?source=direct#skills`)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('.desktop-rail a[lang="ru"]')).toHaveAttribute(
      'href',
      '/ru/?source=direct#skills',
    )
    await expect(
      page.locator('.desktop-rail .section-navigation a').nth(3),
    ).toHaveAttribute('href', `/${locale}/?source=direct#projects`)
    await expect(page.locator('main > section')).toHaveCount(7)
    await expect(page.locator('h1')).toHaveCount(1)
  }
  expect(errors).toEqual([])
})

for (const width of [390, 1440]) {
  test(`language round trips preserve every section, query and history at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type()))
        errors.push(message.text())
    })
    await page.goto('/en/?source=a%20b&tag=one&tag=two&flag')
    for (const id of sections) {
      // Manual scrolling must take precedence over an older URL fragment.
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView())
      const hash = id === 'hero' ? '' : `#${id}`
      const switcher = width < 768 ? '.mobile-topbar' : '.desktop-rail'
      const russian = page.locator(`${switcher} a[lang="ru"]`)
      await expect(russian).toHaveAttribute(
        'href',
        `/ru/?source=a+b&tag=one&tag=two&flag${hash}`,
      )
      if (width < 768) {
        // Focus without scrolling the sticky header's original document position.
        await page
          .locator('.menu-trigger')
          .evaluate((el) => (el as HTMLElement).focus({ preventScroll: true }))
        await page.keyboard.press('Enter')
        await page.getByRole('dialog').locator('a[lang="ru"]').click()
        await expect(page.getByRole('dialog')).toHaveCount(0)
      } else {
        await russian.click()
      }
      await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
      const assertContext = async (locale: string) => {
        await expect(page).toHaveURL(
          new RegExp(`/${locale}/\\?source=a\\+b&tag=one&tag=two&flag${hash}$`),
        )
        await expect(
          page.locator(`${switcher} a[lang="${locale}"]`),
        ).toHaveAttribute('aria-current', 'page')
        await expect
          .poll(() =>
            page
              .locator(`#${id}`)
              .evaluate((el) => el.getBoundingClientRect().top),
          )
          .toBeLessThan(900)
        await expect(
          page.locator(
            `${switcher} a[lang="${locale === 'en' ? 'ru' : 'en'}"]`,
          ),
        ).toHaveAttribute(
          'href',
          `/${locale === 'en' ? 'ru' : 'en'}/?source=a+b&tag=one&tag=two&flag${hash}`,
        )
      }
      await assertContext('ru')
      await page
        .locator(`${switcher} a[lang="en"]`)
        .evaluate((el) => (el as HTMLElement).focus({ preventScroll: true }))
      await page.keyboard.press('Enter')
      await assertContext('en')
      await page.goBack()
      await assertContext('ru')
      await page.goForward()
      await assertContext('en')
    }
    expect(errors).toEqual([])
    await expect(page.locator('main > section')).toHaveCount(7)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}
