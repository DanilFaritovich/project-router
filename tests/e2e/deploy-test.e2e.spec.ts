import { test, expect } from '@playwright/test'

for (const javaScriptEnabled of [false, true]) {
  test.describe(`deploy test with JavaScript ${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled })

    for (const locale of ['en', 'ru']) {
      test(`direct /${locale}/deploy-test/ is empty and returns 200`, async ({
        page,
      }) => {
        const response = await page.goto(`/${locale}/deploy-test/`)
        expect(response?.status()).toBe(200)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          'content',
          'noindex',
        )
        await expect(page.locator('body')).toHaveText('')
        await expect(page.locator('#app > div')).toBeEmpty()
        await expect(
          page.locator('a, button, input, img, canvas, nav, header, footer'),
        ).toHaveCount(0)
      })
    }
  })
}
