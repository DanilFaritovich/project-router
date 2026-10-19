import { test, expect } from '@playwright/test'
import { existsSync } from 'node:fs'

const supplied = ['backend', 'ai', 'data'].every((id) =>
  ['en', 'ru'].every((language) =>
    existsSync(`public/resumes/${id}-${language}.pdf`),
  ),
)

test.describe('real resume viewer', () => {
  test.skip(
    !supplied,
    'Owner resume archive is missing; never substitute a fabricated PDF.',
  )
  for (const width of [320, 390, 768, 1440]) {
    test(`renders and contains controls without page overflow at ${width}px`, async ({
      page,
    }) => {
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
      const downloadEvent = page.waitForEvent('download')
      await dialog.getByRole('link', { name: 'Download PDF' }).click()
      expect((await downloadEvent).suggestedFilename()).toBe('backend-ru.pdf')
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
