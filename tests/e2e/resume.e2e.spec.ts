import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.describe('real resume viewer', () => {
  for (const width of [320, 390, 768, 1440]) {
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
      await dialog.getByRole('button', { name: 'Next page' }).click()
      await expect(dialog.locator('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      )
      await expect(dialog.locator('.pdf-page-count')).toHaveText('Page 2 / 2')
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
      const viewport = dialog.locator('.pdf-viewport')
      expect(
        await viewport.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: testInfo.outputPath(`resume-modal-${width}.png`),
        })
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
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const language of ['en', 'ru']) {
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
        await expect(dialog.locator('a[target="_blank"]')).toHaveAttribute(
          'href',
          url,
        )
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
