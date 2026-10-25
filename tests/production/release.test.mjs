import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import {
  requireProductionOrigin,
  productionOrigin as origin,
  verifyOrigin,
} from '../../scripts/verify-origin.mjs'
import {
  imageDigest,
  verifiedManifest,
  amd64Descriptor,
  verifiedRuntimeConfig,
  publicContentEvidence,
} from '../../scripts/verify-image.mjs'
import { Buffer } from 'node:buffer'

test('public acceptance binds extracted HTML bytes to the exact published digest', () => {
  const image = `ghcr.io/danilfaritovich/project-router@sha256:${'a'.repeat(64)}`
  const environment = {
    GITHUB_REPOSITORY: 'DanilFaritovich/project-router',
    GITHUB_SHA: 'b'.repeat(40),
    GITHUB_REF: 'refs/heads/main',
    GITHUB_RUN_ID: '123',
    GITHUB_RUN_ATTEMPT: '2',
  }
  const html = Buffer.from('<html>exact image content</html>')
  const evidence = publicContentEvidence(html, image, environment)
  assert.equal(evidence.imageDigest, `sha256:${'a'.repeat(64)}`)
  assert.equal(
    evidence.htmlSha256,
    createHash('sha256').update(html).digest('hex'),
  )
  assert.equal(evidence.sourceSha, environment.GITHUB_SHA)
  assert.notEqual(
    publicContentEvidence(Buffer.from('old content'), image, environment)
      .htmlSha256,
    evidence.htmlSha256,
  )
  assert.throws(() =>
    publicContentEvidence(html, 'project-router:latest', environment),
  )
})

function page(locale) {
  const graph = [
    {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      url: `${origin}/${locale}/`,
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      author: { '@id': `${origin}/#person` },
    },
  ]
  return `<html lang="${locale}"><head>
    <link rel="canonical" href="${origin}/${locale}/">
    <link rel="alternate" hreflang="en" href="${origin}/en/">
    <link rel="alternate" hreflang="ru" href="${origin}/ru/">
    <link rel="alternate" hreflang="x-default" href="${origin}/en/">
    <meta property="og:url" content="${origin}/${locale}/">
    <meta property="og:image" content="${origin}/social/portfolio-${locale}.png">
    <meta name="twitter:image" content="${origin}/social/portfolio-${locale}.png">
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </head><body></body></html>`
}

async function fixture(callback) {
  const directory = await mkdtemp(
    join(tmpdir(), 'project-router-verifier-test-'),
  )
  try {
    for (const locale of ['en', 'ru']) {
      await mkdir(join(directory, locale))
      await writeFile(join(directory, locale, 'index.html'), page(locale))
    }
    await writeFile(
      join(directory, 'sitemap.xml'),
      `<urlset><url><loc>${origin}/en/</loc></url><url><loc>${origin}/ru/</loc></url></urlset>`,
    )
    await writeFile(
      join(directory, 'robots.txt'),
      `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    )
    await callback(directory)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('publication rejects missing, malformed, alternate and normalized-away origins', () => {
  assert.equal(requireProductionOrigin(origin), origin)
  for (const value of [
    undefined,
    '',
    'https://portfolio.test',
    'http://danil-miftakhov.dev',
    `${origin}/`,
    `${origin}/path`,
    `${origin}?`,
    `${origin}#`,
    'https://danil-miftakhov.dev.evil',
    ' https://danil-miftakhov.dev',
    'https://user@danil-miftakhov.dev',
  ]) {
    assert.throws(() => requireProductionOrigin(value))
  }
})

test('origin verification reads local metadata without executing page scripts', async () => {
  await fixture(async (directory) => {
    await writeFile(
      join(directory, 'en/index.html'),
      page('en').replace(
        '</head>',
        '<script>throw new Error("must not execute")</script></head>',
      ),
    )
    await verifyOrigin(directory, origin)
    await assert.rejects(verifyOrigin(directory, 'https://portfolio.test'))
  })
})

for (const marker of [
  `rel="canonical" href="${origin}`,
  `hreflang="ru" href="${origin}`,
  `property="og:url" content="${origin}`,
  `property="og:image" content="${origin}`,
  `name="twitter:image" content="${origin}`,
  `"@id":"${origin}/#person`,
  `"url":"${origin}/en/`,
  `"url":"${origin}/"`,
]) {
  test(`rejects independently corrupted HTML metadata: ${marker}`, async () => {
    await fixture(async (directory) => {
      await writeFile(
        join(directory, 'en/index.html'),
        page('en').replace(
          marker,
          marker.replace(origin, 'https://wrong.test'),
        ),
      )
      await assert.rejects(verifyOrigin(directory, origin))
    })
  })
}
for (const file of ['sitemap.xml', 'robots.txt']) {
  test(`rejects wrong origin in ${file}`, async () => {
    await fixture(async (directory) => {
      await writeFile(
        join(directory, file),
        file.endsWith('xml')
          ? '<urlset><loc>https://wrong.test/en/</loc></urlset>'
          : 'Sitemap: https://wrong.test/sitemap.xml\n',
      )
      await assert.rejects(verifyOrigin(directory, origin))
    })
  })
}

test('registry identity rejects mutable tags, wrong repository and corrupt bytes', () => {
  const bytes = Buffer.from('{"schemaVersion":2}')
  const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`
  const image = `ghcr.io/danilfaritovich/project-router@${digest}`
  assert.equal(imageDigest(image), digest)
  for (const value of [
    image.replace('@', ':'),
    image.replace('project-router', 'other'),
    'project-router:local',
  ])
    assert.throws(() => imageDigest(value))
  assert.deepEqual(verifiedManifest(bytes, digest).value, { schemaVersion: 2 })
  assert.deepEqual(
    verifiedManifest(Buffer.concat([bytes, Buffer.from('\n')]), digest).raw,
    bytes,
  )
  assert.throws(() => verifiedManifest(Buffer.from('{}'), digest))
})

test('index selection rejects missing, wrong or ambiguous runtime platform', () => {
  const descriptor = {
    digest: `sha256:${'a'.repeat(64)}`,
    platform: { os: 'linux', architecture: 'amd64' },
  }
  assert.equal(
    amd64Descriptor({
      manifests: [
        descriptor,
        { platform: { os: 'unknown', architecture: 'unknown' } },
      ],
    }),
    descriptor,
  )
  for (const manifests of [
    [],
    [{ ...descriptor, platform: { os: 'linux', architecture: 'arm64' } }],
    [descriptor, descriptor],
  ])
    assert.throws(() => amd64Descriptor({ manifests }))
})

test('exported config binds runtime on classic and containerd stores without treating index ID as config', () => {
  const config = {
    os: 'linux',
    architecture: 'amd64',
    rootfs: { diff_ids: ['sha256:layer'] },
    config: { User: '101:101' },
  }
  const bytes = Buffer.from(JSON.stringify(config))
  const descriptor = {
    digest: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
    size: bytes.length,
  }
  const metadata = {
    Id: 'sha256:index-id',
    RootFS: { Layers: config.rootfs.diff_ids },
    Config: config.config,
  }
  assert.deepEqual(
    verifiedRuntimeConfig(metadata, bytes, descriptor).value,
    config,
  )
  assert.deepEqual(
    verifiedRuntimeConfig(
      { ...metadata, Id: descriptor.digest },
      bytes,
      descriptor,
    ).value,
    config,
  )
  assert.throws(() =>
    verifiedRuntimeConfig(
      { ...metadata, RootFS: { Layers: [] } },
      bytes,
      descriptor,
    ),
  )
  assert.throws(() =>
    verifiedRuntimeConfig(
      { ...metadata, Config: { User: '0:0' } },
      bytes,
      descriptor,
    ),
  )
  assert.throws(() =>
    verifiedRuntimeConfig(metadata, Buffer.from('{}'), descriptor),
  )
  const arm = Buffer.from(JSON.stringify({ ...config, architecture: 'arm64' }))
  const armDescriptor = {
    digest: `sha256:${createHash('sha256').update(arm).digest('hex')}`,
    size: arm.length,
  }
  assert.throws(() => verifiedRuntimeConfig(metadata, arm, armDescriptor))
})
