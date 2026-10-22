import { test, expect, type Locator } from '@playwright/test'
import { readFile } from 'node:fs/promises'

type PdfLink = { id: string; url: string; rect: number[] }
const sourceLinks = new Map<
  string,
  Promise<{ width: number; links: PdfLink[] }>
>()
async function expectPdfLinks(
  dialog: Locator,
  name: string,
  pageNumber: number,
) {
  const key = `${name}:${pageNumber}`
  if (!sourceLinks.has(key))
    sourceLinks.set(
      key,
      (async () => {
        const { getDocument, AnnotationType } =
          await import('pdfjs-dist/legacy/build/pdf.mjs')
        const task = getDocument({
          data: new Uint8Array(await readFile(`public/resumes/${name}`)),
          standardFontDataUrl: `${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/`,
        })
        try {
          const pdf = await task.promise
          const source = await pdf.getPage(pageNumber)
          const viewport = source.getViewport({ scale: 1 })
          const annotations = await source.getAnnotations()
          return {
            width: viewport.width,
            links: annotations
              .filter((a) => a.annotationType === AnnotationType.LINK && a.url)
              .map((a) => ({
                id: a.id,
                url: a.url,
                rect: [
                  ...viewport.convertToViewportPoint(a.rect[0], a.rect[1]),
                  ...viewport.convertToViewportPoint(a.rect[2], a.rect[3]),
                ],
              })),
          }
        } finally {
          await task.destroy()
        }
      })(),
    )
  const expected = await sourceLinks.get(key)!
  await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  )
  await expect(dialog.locator('canvas')).toBeVisible()
  const links = dialog.locator('.pdf-annotations a')
  await expect(links).toHaveCount(expected.links.length)
  const canvas = await dialog.locator('canvas').boundingBox()
  expect(canvas).not.toBeNull()
  const scale = canvas!.width / expected.width
  for (const annotation of expected.links) {
    const link = dialog.locator(`[data-annotation-id="${annotation.id}"] a`)
    await expect(link).toHaveAttribute('href', annotation.url)
    await expect(link).toHaveAttribute('aria-label', annotation.url)
    if (!annotation.url.startsWith('mailto:')) {
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    const bounds = (await link.boundingBox())!
    const [x1, y1, x2, y2] = annotation.rect as [number, number, number, number]
    expect(
      Math.abs(bounds.x - canvas!.x - Math.min(x1, x2) * scale),
    ).toBeLessThan(1)
    expect(
      Math.abs(bounds.y - canvas!.y - Math.min(y1, y2) * scale),
    ).toBeLessThan(1)
    expect(Math.abs(bounds.width - Math.abs(x2 - x1) * scale)).toBeLessThan(1)
    expect(Math.abs(bounds.height - Math.abs(y2 - y1) * scale)).toBeLessThan(1)
  }
}

test.describe('real resume viewer', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`renders and contains controls without page overflow at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/en/#resume')
      const trigger = page
        .locator('#resume')
        .getByRole('button', { name: 'View PDF' })
        .first()
      await trigger.click()
      const dialog = page.getByRole('dialog')
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expect(dialog.locator('canvas')).toBeVisible()
      const viewport = dialog.locator('.pdf-viewport')
      const geometry = () =>
        viewport.evaluate((el) => {
          const style = getComputedStyle(el)
          const canvas = el.querySelector('canvas')!.getBoundingClientRect()
          const available =
            el.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight)
          const left = canvas.left - el.getBoundingClientRect().left
          const right = el.getBoundingClientRect().right - canvas.right
          return {
            available,
            width: canvas.width,
            centered: Math.abs(left - right),
            overflow: el.scrollWidth > el.clientWidth,
          }
        })
      await expectPdfLinks(dialog, 'backend-en.pdf', 1)
      const initial = await geometry()
      expect(initial.overflow).toBe(false)
      expect(initial.width).toBeLessThanOrEqual(initial.available)
      expect(initial.centered).toBeLessThanOrEqual(1)
      await page.screenshot({
        path: testInfo.outputPath(`resume-initial-${width}.png`),
      })
      if (width === 1440)
        await expect(dialog.locator('.pdf-zoom')).toHaveText('125%')
      if (width <= 600)
        expect(initial.available - initial.width).toBeLessThan(1)

      await expect(
        dialog.getByRole('button', { name: 'Close', exact: true }),
      ).toBeFocused()
      await expect(
        dialog.getByRole('link', { name: 'Download PDF' }),
      ).toHaveAttribute('href', '/resumes/backend-en.pdf')
      await dialog.getByRole('button', { name: 'RU', exact: true }).click()
      await expect(dialog.locator('canvas')).toHaveAttribute('lang', 'ru')
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expect(
        dialog.getByRole('link', { name: 'Download PDF' }),
      ).toHaveAttribute('href', '/resumes/backend-ru.pdf')
      await expect(dialog.locator('.pdf-page-count')).toHaveText('Page 1 / 2')
      await expectPdfLinks(dialog, 'backend-ru.pdf', 1)
      await dialog.getByRole('button', { name: 'Next page' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expect(dialog.locator('.pdf-page-count')).toHaveText('Page 2 / 2')
      await expectPdfLinks(dialog, 'backend-ru.pdf', 2)
      await expect(
        dialog.getByRole('button', { name: 'Next page' }),
      ).toBeDisabled()
      await dialog.getByRole('button', { name: 'Previous page' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      const downloadEvent = page.waitForEvent('download')
      await dialog.getByRole('link', { name: 'Download PDF' }).click()
      const download = await downloadEvent
      expect(download.suggestedFilename()).toBe('backend-ru.pdf')
      expect(await readFile((await download.path())!)).toEqual(
        await readFile('public/resumes/backend-ru.pdf'),
      )
      await dialog.getByRole('button', { name: 'Zoom in' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expectPdfLinks(dialog, 'backend-ru.pdf', 1)
      await dialog.getByRole('button', { name: 'Fit width' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      await expectPdfLinks(dialog, 'backend-ru.pdf', 1)
      const fitted = await geometry()
      expect(fitted.available - fitted.width).toBeGreaterThanOrEqual(-0.1)
      expect(fitted.available - fitted.width).toBeLessThan(1)
      expect(fitted.centered).toBeLessThanOrEqual(1)
      expect(
        await viewport.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: testInfo.outputPath(`resume-modal-${width}.png`),
        })
      }
      if (width === 1440) {
        await page.setViewportSize({ width: 768, height: 900 })
        await expect
          .poll(async () => {
            const { available, width } = await geometry()
            return Math.abs(available - width)
          })
          .toBeLessThan(1)
        await expectPdfLinks(dialog, 'backend-ru.pdf', 1)
        await dialog.getByRole('button', { name: 'Zoom out' }).click()
        await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
          'aria-busy',
          'false',
        )
        const manualZoom = await dialog.locator('.pdf-zoom').textContent()
        const manualWidth = (await geometry()).width
        await page.setViewportSize({ width: 1440, height: 900 })
        await expect(dialog.locator('.pdf-zoom')).toHaveText(manualZoom!)
        expect((await geometry()).width).toBe(manualWidth)
        await expectPdfLinks(dialog, 'backend-ru.pdf', 1)
      }
      const fallback = dialog.getByRole('link', { name: /Open original PDF/ })
      await fallback.focus()
      await page.keyboard.press('Tab')
      await expect(
        dialog.getByRole('link', { name: 'Download PDF' }),
      ).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(fallback).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
      await expect(trigger).toBeFocused()
    })
  }

  test('opens all six original documents with the matching download and fallback', async ({
    page,
  }) => {
    await page.context().route(/^https:\/\//, (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<p>External destination intercepted</p>',
      }),
    )
    // Exercise new-tab behavior without relying on Chromium's native PDF UI.
    let originalNavigation = false
    await page.context().route('**/resumes/*.pdf', (route) =>
      originalNavigation && route.request().isNavigationRequest()
        ? route.fulfill({
            contentType: 'text/html',
            body: '<title>Original PDF</title>',
          })
        : route.continue(),
    )
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const language of ['en', 'ru']) {
      await page.setViewportSize({
        width: language === 'en' ? 390 : 1440,
        height: 900,
      })
      await page.goto(`/${language}/#resume`)
      const cards = page.locator('#resume article')
      for (const [index, id] of ['backend', 'ai', 'data'].entries()) {
        const url = `/resumes/${id}-${language}.pdf`
        await expect(cards.nth(index).locator('a[download]')).toHaveAttribute(
          'href',
          url,
        )
        await cards.nth(index).getByRole('button').click()
        const dialog = page.getByRole('dialog')
        await expect(dialog.locator('canvas')).toBeVisible()
        await expect(dialog.locator('canvas')).toHaveAttribute('lang', language)
        await expect(dialog.locator('.pdf-page-count')).toContainText('1 / 2')
        await expect(dialog.locator('a[download]')).toHaveAttribute('href', url)
        await expect(
          dialog.locator('footer a[target="_blank"]'),
        ).toHaveAttribute('href', url)
        await expectPdfLinks(dialog, `${id}-${language}.pdf`, 1)
        const email = dialog.locator('.pdf-annotations a[href^="mailto:"]')
        await email.evaluate((el) =>
          el.addEventListener('click', (event) => {
            event.preventDefault()
            el.setAttribute('data-clicked', 'true')
          }),
        )
        await email.click()
        await expect(email).toHaveAttribute('data-clicked', 'true')
        // Real pointer/keyboard activation without contacting external services.
        for (const pageNumber of [1, 2]) {
          if (pageNumber === 2) {
            await dialog
              .getByRole('button', {
                name: language === 'en' ? 'Next page' : 'Следующая страница',
              })
              .click()
            await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
              'aria-busy',
              'false',
            )
          }
          await expectPdfLinks(dialog, `${id}-${language}.pdf`, pageNumber)
          const link = dialog
            .locator('.pdf-annotations a[href^="https:"]')
            .first()
          const href = await link.getAttribute('href')
          const popupEvent = page.waitForEvent('popup')
          if (pageNumber === 1) await link.click()
          else {
            await link.focus()
            await page.keyboard.press('Enter')
          }
          const popup = await popupEvent
          await popup.waitForURL(href!)
          expect(await popup.evaluate(() => window.opener)).toBeNull()
          await popup.close()
          await expect(dialog).toBeVisible()
        }
        for (const name of language === 'en'
          ? ['Zoom in', 'Zoom out', 'Fit width']
          : ['Увеличить', 'Уменьшить', 'По ширине']) {
          await dialog.getByRole('button', { name, exact: true }).click()
          await expectPdfLinks(dialog, `${id}-${language}.pdf`, 2)
        }
        const downloadEvent = page.waitForEvent('download')
        await dialog.locator('a[download]').click()
        const download = await downloadEvent
        expect(download.suggestedFilename()).toBe(`${id}-${language}.pdf`)
        expect(await readFile((await download.path())!)).toEqual(
          await readFile(`public${url}`),
        )
        originalNavigation = true
        const originalEvent = page.waitForEvent('popup')
        await dialog.locator('footer a').click()
        const original = await originalEvent
        await original.waitForURL(`**${url}`)
        expect(await original.evaluate(() => window.opener)).toBeNull()
        await original.close()
        originalNavigation = false
        // Assert that the rendered canvas contains document content, beyond its white background.
        expect(
          await dialog
            .locator('canvas')
            .evaluate((element: HTMLCanvasElement) => {
              const { data } = element
                .getContext('2d')!
                .getImageData(0, 0, element.width, element.height)
              let ink = 0
              for (let offset = 0; offset < data.length; offset += 4) {
                if (
                  data[offset]! < 200 &&
                  data[offset + 1]! < 200 &&
                  data[offset + 2]! < 200
                )
                  ink++
              }
              return ink
            }),
        ).toBeGreaterThan(100)
        await page.keyboard.press('Escape')
        await expect(dialog).not.toBeVisible()
      }
    }
    expect(errors).toEqual([])
  })

  test('retries a failed PDF request and releases the modal on close', async ({
    page,
  }) => {
    await page.goto('/ru/#resume')
    let fail = true
    await page.route('**/resumes/backend-ru.pdf', (route) =>
      fail ? route.abort() : route.continue(),
    )
    await page
      .locator('#resume')
      .getByRole('button', { name: 'Открыть PDF' })
      .first()
      .click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('alert')).toBeVisible()
    await expect(
      dialog.getByRole('link', { name: /Открыть исходный/ }),
    ).toHaveAttribute('href', '/resumes/backend-ru.pdf')
    fail = false
    await dialog.getByRole('button', { name: 'Повторить' }).click()
    await expect(dialog.locator('canvas')).toBeVisible()
    await dialog.getByRole('button', { name: 'Закрыть', exact: true }).click()
    await expect(dialog).not.toBeVisible()
  })
})
