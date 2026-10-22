import AxeBuilder from '@axe-core/playwright'
import { test, expect, type Page } from '@playwright/test'

async function audit(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  // WCAG 2.5.8 exempts inline links: these rectangles match text in the
  // unchanged owner PDF. Enlarging them would overlap adjacent document links.
  for (const violation of result.violations) {
    if (violation.id === 'target-size') {
      const inlineLinks = page.locator('.pdf-annotations a')
      const ids = await inlineLinks.evaluateAll((links) =>
        links.map((link) => `#${link.id}`),
      )
      violation.nodes = violation.nodes.filter(
        (node) =>
          !node.target.every(
            (target) => typeof target === 'string' && ids.includes(target),
          ),
      )
    }
  }
  expect(
    result.violations
      .filter((violation) => violation.nodes.length)
      .map(({ id, nodes }) => ({
        id,
        targets: nodes.map((node) => node.target),
      })),
  ).toEqual([])
}

for (const width of [320, 390, 768, 1024, 1440]) {
  for (const locale of ['en', 'ru']) {
    test(`WCAG scan and review captures ${locale} ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      const failures: string[] = []
      page.on('pageerror', (error) => failures.push(error.message))
      page.on('response', (response) => {
        if (response.status() >= 400)
          failures.push(`${response.status()} ${response.url()}`)
      })
      await page.goto(`/${locale}/`)
      // Decode lazy images before capturing the full page.
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded()
        await image.evaluate((element) =>
          (element as HTMLImageElement).decode(),
        )
      }
      await page.evaluate(() => window.scrollTo(0, 0))
      // Text ranges detect overlap even when the document itself has no overflow.
      const overlaps = await page
        .locator('.portfolio-section')
        .evaluateAll((sections) =>
          sections.flatMap((section) => {
            const heading = section.querySelector('.section-heading h2')!
            const content = section.children[1]!.getBoundingClientRect()
            const range = document.createRange()
            range.selectNodeContents(heading)
            return [...range.getClientRects()]
              .filter(
                (rect) =>
                  rect.left < content.right &&
                  rect.right > content.left &&
                  rect.top < content.bottom &&
                  rect.bottom > content.top,
              )
              .map(() => heading.textContent)
          }),
        )
      expect(overlaps).toEqual([])
      await audit(page)
      await page.screenshot({
        path: testInfo.outputPath(`page-${locale}-${width}.jpg`),
        fullPage: true,
        type: 'jpeg',
        quality: 75,
      })
      if (width < 768) {
        await page.locator('.menu-trigger').click()
        await expect(page.getByRole('dialog').getByRole('button')).toBeFocused()
        await audit(page)
        await page.screenshot({
          path: testInfo.outputPath(`menu-${locale}-${width}.jpg`),
          fullPage: false,
          type: 'jpeg',
          quality: 75,
        })
        await page.keyboard.press('Escape')
      }
      await page.locator('#resume article').first().getByRole('button').click()
      const dialog = page.getByRole('dialog')
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expect(dialog.locator('canvas')).toBeVisible()
      await audit(page)
      await page.screenshot({
        path: testInfo.outputPath(`pdf-${locale}-${width}.jpg`),
        type: 'jpeg',
        quality: 75,
      })
      await page.keyboard.press('Escape')
      expect(failures).toEqual([])
    })
  }
}
