import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const locale of ['en', 'ru']) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`services ${locale} ${width}px: direct entry, FAQ, menu, contacts and layout`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      const response = await page.goto(`/${locale}/freelance/`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(
        locale === 'ru' ? 'Меньше ручной работы.' : 'Less manual work.',
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      const faq = page.locator('details').first()
      await faq.locator('summary').focus()
      await page.keyboard.press('Enter')
      await expect(faq).toHaveAttribute('open', '')
      await expect(faq.locator('p')).toBeVisible()
      await page.keyboard.press('Enter')
      await expect(faq).not.toHaveAttribute('open', '')
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
      await expect
        .poll(async () =>
          Math.round(
            (await page.locator('.freelance-header-shell').boundingBox())!.y,
          ),
        )
        .toBe(0)
      await page.locator('.freelance-header .brand').click()
      await expect(page).toHaveURL(new RegExp(`/${locale}/freelance/#main$`))
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
      await page.evaluate(() => {
        ;(document.activeElement as HTMLElement)?.blur()
        window.scrollTo(0, 0)
      })
      await page.screenshot({
        path: testInfo.outputPath(`freelance-${locale}-${width}.png`),
        fullPage: true,
      })
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([])
      if (locale === 'ru') {
        const currency = page.getByRole('button', { name: 'Цены в USD' })
        await currency.click()
        const dialog = page.getByRole('dialog')
        await expect(dialog).toContainText('от $40')
        await expect(
          dialog.getByRole('button', { name: 'Закрыть' }),
        ).toBeFocused()
        await page.screenshot({ path: testInfo.outputPath(`usd-${width}.png`) })
        await page.keyboard.press('Escape')
        await expect(dialog).not.toBeVisible()
        await expect(currency).toBeFocused()
      }
      if (width < 1000) {
        const trigger = page.locator('.freelance-menu-trigger')
        await trigger.click()
        const menu = page.getByRole('dialog')
        await expect(menu.getByRole('button')).toBeFocused()
        await page.keyboard.press('Shift+Tab')
        await expect(menu.locator('a[lang="ru"]')).toBeFocused()
        await page.keyboard.press('Escape')
        await expect(trigger).toBeFocused()
        await trigger.click()
        await menu.locator('a[href="#cases"]').click()
        await expect(menu).not.toBeVisible()
        await expect(page.locator('#cases-heading')).toBeFocused()
        expect(
          (await page.locator('#cases-heading').boundingBox())!.y,
        ).toBeGreaterThanOrEqual(
          (await page.locator('.freelance-header-shell').boundingBox())!.height,
        )
      }
      const other = locale === 'ru' ? 'en' : 'ru'
      await page.locator(`header a[lang="${other}"]`).click()
      await expect(page).toHaveURL(new RegExp(`/${other}/freelance/`))
      await expect(page.locator('html')).toHaveAttribute('lang', other)
      if (width < 1000) {
        await page.locator('.freelance-menu-trigger').click()
        await page
          .getByRole('dialog')
          .locator('.freelance-portfolio-link')
          .click()
      } else {
        await expect(page.locator('.freelance-desktop-links a')).toHaveCount(3)
        for (const link of await page
          .locator('.freelance-desktop-links a')
          .all())
          await expect(link).toHaveAttribute('href', /^#/)
        await page.locator('header .freelance-portfolio-link').click()
      }
      await expect(page).toHaveURL(new RegExp(`/${other}/$`))
      await expect(page.locator('#hero img')).toBeVisible()
      if (width < 768) {
        await page.locator('.menu-trigger').click()
        await page.locator('.menu-panel .client-link').click()
      } else await page.locator('.desktop-rail .client-link').click()
      await expect(page).toHaveURL(new RegExp(`/${other}/freelance/`))
      expect(errors).toEqual([])
    })
  }
}

test('services contact actions open the configured destinations safely', async ({
  page,
  context,
}) => {
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<title>Contact destination</title>',
    }),
  )
  await page.goto('/ru/freelance/')
  await page.locator('.freelance-hero .action').click()
  await expect(page).toHaveURL(/#contacts$/)
  await expect(page.locator('#contacts a[href^="mailto:"]')).toHaveAttribute(
    'href',
    'mailto:danilfaritovichwork@gmail.com',
  )
  for (const link of await page
    .locator('#contacts a[href^="https://"]')
    .all()) {
    const expected = await link.getAttribute('href')
    const popupPromise = page.waitForEvent('popup')
    await link.click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    expect(popup.url()).toBe(expected)
    expect(await popup.evaluate(() => window.opener)).toBeNull()
    await popup.close()
  }
  await page.reload()
  await expect(page.locator('h1')).toContainText('Меньше ручной работы.')
})
