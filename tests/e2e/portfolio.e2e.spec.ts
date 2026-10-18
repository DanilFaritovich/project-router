import { test, expect } from '@playwright/test'

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout keeps consistent content spacing without overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const locale of ['en', 'ru']) {
      await page.goto(`/${locale}/`)
      const geometry = await page.evaluate(() => {
        const main = document.querySelector('main')!
        const rail = document.querySelector('.desktop-rail')!
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          railRight: rail.getBoundingClientRect().right,
          sectionLefts: [...main.querySelectorAll(':scope > section')].map(
            (section) => section.getBoundingClientRect().left,
          ),
        }
      })
      expect(geometry.overflow).toBe(false)
      const expectedLeft =
        width >= 768
          ? geometry.railRight + (width >= 1200 ? 48 : 32)
          : width < 360
            ? 20
            : 24
      for (const left of geometry.sectionLefts) expect(left).toBe(expectedLeft)
    }
  })
}

test('desktop section tracking and language switching preserve the visible section', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/en/')
  const navigation = page.locator('.desktop-rail .section-navigation')
  for (const id of [
    'about',
    'skills',
    'projects',
    'tools',
    'resume',
    'contacts',
  ]) {
    await navigation.locator(`a[href$="#${id}"]`).click()
    await expect(
      navigation.locator('[aria-current="location"]'),
    ).toHaveAttribute('href', `/en/#${id}`)
  }
  // A language switch follows manual scrolling as well as clicked anchors.
  await page.locator('#projects').evaluate((el) => el.scrollIntoView())
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
    'href',
    '/en/#projects',
  )
  await page.locator('.desktop-rail a[lang="ru"]').click()
  await expect(page).toHaveURL(/\/ru\/#projects$/)
  await expect(page.locator('#projects-heading')).toHaveText(
    'Избранные проекты',
  )
  await page.locator('#hero').evaluate((el) => el.scrollIntoView())
  await expect(page.locator('.desktop-rail a[lang="en"]')).toHaveAttribute(
    'href',
    '/en/',
  )
})

test('mobile menu supports focus, Escape, section navigation and language selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 615 })
  await page.goto('/en/')
  const trigger = page.locator('.menu-trigger')
  await trigger.click()
  const dialog = page.getByRole('dialog')
  const close = dialog.getByRole('button', { name: 'Close menu' })
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.locator('a[lang="ru"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.locator('a[href$="#resume"]').click()
  await expect(dialog).toHaveCount(0)
  await expect(page.locator('#resume-heading')).toBeFocused()
  await expect(page).toHaveURL(/#resume$/)
  await page.locator('.mobile-topbar a[lang="ru"]').click()
  await expect(page).toHaveURL(/\/ru\/#resume$/)
  await trigger.click()
  await expect(
    dialog.getByRole('button', { name: 'Закрыть меню' }),
  ).toBeVisible()
  await dialog.locator('a[href$="#contacts"]').click()
  await expect(page.locator('#contacts-heading')).toBeFocused()
  await expect(dialog).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
