import { describe, expect, it } from 'vitest'
import { featured, more, tools } from '../../src/content/projects'
import { messages } from '../../src/locales'

const catalog = [...featured, ...more, ...tools]

describe('approved project catalog', () => {
  it('keeps the nine unique projects in their reviewed groups and order', () => {
    expect(featured.map(({ id }) => id)).toEqual([
      'moon',
      'support',
      'geocoder',
    ])
    expect(more.map(({ id }) => id)).toEqual(['task', 'maxim', 'avito'])
    expect(tools.map(({ id }) => id)).toEqual(['server', 'worker', 'standards'])
    expect(new Set(catalog.map(({ id }) => id)).size).toBe(9)
    expect(
      catalog.filter(({ emphasized }) => emphasized).map(({ id }) => id),
    ).toEqual(['moon', 'server'])
  })

  it('exposes only the four approved versioned releases', () => {
    expect(
      catalog
        .filter(({ releaseUrl }) => releaseUrl)
        .map(({ id, releaseUrl }) => [id, releaseUrl]),
    ).toEqual([
      [
        'moon',
        'https://github.com/DanilFaritovich/Moon-courier-crisis-game/releases/tag/v1.0.0',
      ],
      [
        'geocoder',
        'https://github.com/DanilFaritovich/yandex-geocoder-region-parser/releases/tag/v1.2.0',
      ],
      [
        'maxim',
        'https://github.com/DanilFaritovich/maxim-ml/releases/tag/v1.0.0',
      ],
      [
        'server',
        'https://github.com/DanilFaritovich/portfolio-server-infrastructure/releases/tag/v1.0.0',
      ],
    ])
  })

  it('links the three unreleased development projects to develop', () => {
    expect(
      catalog
        .filter(({ repositoryUrl }) => repositoryUrl.endsWith('/tree/develop'))
        .map(({ id, repositoryUrl, releaseUrl }) => [
          id,
          repositoryUrl,
          releaseUrl,
        ]),
    ).toEqual([
      [
        'support',
        'https://github.com/DanilFaritovich/support-assistant-llm/tree/develop',
        undefined,
      ],
      [
        'worker',
        'https://github.com/DanilFaritovich/codex-free-worker-mcp/tree/develop',
        undefined,
      ],
      [
        'standards',
        'https://github.com/DanilFaritovich/codex-development-standards/tree/develop',
        undefined,
      ],
    ])
    expect(
      catalog.every(({ repositoryUrl }) =>
        repositoryUrl.startsWith('https://github.com/DanilFaritovich/'),
      ),
    ).toBe(true)
  })

  it('provides full descriptions, technology labels and localized image alternatives', () => {
    for (const item of catalog) {
      expect(item.stack.length).toBeGreaterThanOrEqual(6)
      expect(new Set(item.stack).size).toBe(item.stack.length)
      for (const locale of ['en', 'ru'] as const) {
        expect(messages[locale][`${item.id}Title`]).not.toBe('')
        expect(messages[locale][`${item.id}Summary`].length).toBeGreaterThan(60)
        expect(messages[locale][`${item.id}Detail`].length).toBeGreaterThan(60)
        if (item.image) {
          expect(messages[locale][item.image.altKey].length).toBeGreaterThan(40)
          expect(item.image.width).toBeGreaterThan(0)
          expect(item.image.height).toBeGreaterThan(0)
        }
      }
    }
    expect(catalog.filter(({ image }) => image).map(({ id }) => id)).toEqual([
      'moon',
      'support',
      'geocoder',
      'maxim',
    ])
    expect(featured.map(({ preview }) => preview)).toEqual(['MC', 'AI', 'ETL'])
  })
})
