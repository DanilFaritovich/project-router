import { test, expect } from '@playwright/test'

for (const locale of ['en', 'ru']) {
  for (const width of [390, 1440]) {
    test(`complete ${locale} catalog and local screenshots at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/${locale}/`)
      const cards = page.locator('.portfolio-card')
      await expect(cards).toHaveCount(9)
      await expect(cards.locator('a')).toHaveCount(13)
      await expect(cards.locator('a[href*="/releases/tag/"]')).toHaveCount(4)
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded()
        await expect(card.locator('h3')).toBeVisible()
        await expect(card.locator('.card-summary')).toBeVisible()
        await expect(card.locator('.card-detail')).toBeVisible()
        await expect(card.locator('.stack')).toBeVisible()
        for (const link of await card.locator('a').all()) {
          await expect(link).toHaveAttribute('target', '_blank')
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        }
        const image = card.locator('img')
        if (await image.count()) {
          await image.scrollIntoViewIfNeeded()
          await expect(image).toBeVisible()
          await expect
            .poll(() =>
              image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0)
          await expect(image).toHaveAttribute('alt', /\S.{40,}/)
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      const actions = page.locator('#project-moon .card-actions a')
      await actions.first().focus()
      await page.keyboard.press('Tab')
      await expect(actions.last()).toBeFocused()
    })
  }
}

test('failed screenshots keep readable cards without empty media or placeholders', async ({
  page,
}) => {
  await page.route('**/assets/*.webp', (route) => route.abort())
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/ru/')
  for (const id of ['moon', 'support', 'geocoder']) {
    const card = page.locator(`#project-${id}`)
    await card.scrollIntoViewIfNeeded()
    await expect(card.locator('.project-preview')).toHaveCount(0)
    await expect(card).not.toHaveClass(/media-card/)
    await expect(card.locator('img')).toHaveCount(0)
    await expect(card.locator('a').first()).toBeVisible()
  }
  const compact = page.locator('#project-maxim')
  await compact.scrollIntoViewIfNeeded()
  await expect(compact.locator('img')).toHaveCount(0)
  await expect(compact.locator('.card-detail')).toBeVisible()
})
