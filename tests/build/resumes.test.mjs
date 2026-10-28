import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('all six owner-supplied resume PDFs are copied unchanged to production', async () => {
  for (const id of ['backend', 'ai', 'data']) {
    for (const language of ['en', 'ru']) {
      const name = `${id}-${language}.pdf`
      const source = await readFile(`public/resumes/${name}`)
      const built = await readFile(`dist/resumes/${name}`)
      assert.equal(source.subarray(0, 5).toString(), '%PDF-', name)
      assert.deepEqual(built, source, name)
    }
  }
})

test('all six review candidates are copied unchanged and linked from localized HTML', async () => {
  for (const language of ['en', 'ru']) {
    const html = await readFile(`dist/${language}/index.html`, 'utf8')
    for (const id of ['backend', 'ai', 'data']) {
      const name = `candidate-${id}-${language}.pdf`
      const source = await readFile(`public/resumes/${name}`)
      const built = await readFile(`dist/resumes/${name}`)
      assert.equal(source.subarray(0, 5).toString(), '%PDF-', name)
      assert.deepEqual(built, source, name)
      assert.ok(html.includes(`/resumes/${name}`), name)
    }
  }
})
