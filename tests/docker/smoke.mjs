import console from 'node:console'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { setTimeout } from 'node:timers/promises'
import process from 'node:process'
import { JSDOM } from 'jsdom'

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')

async function healthy(docker, id) {
  const deadline = Date.now() + 60000
  while (Date.now() < deadline) {
    const state = JSON.parse(docker('inspect', id))[0].State
    assert.equal(state.Running, true, 'server exited')
    if (state.Health.Status === 'healthy') return
    assert.notEqual(state.Health.Status, 'unhealthy', 'HTTP healthcheck failed')
    // Bounded readiness polling, not an arbitrary startup delay.
    await setTimeout(250)
  }
  assert.fail('HTTP healthcheck timed out after 60s')
}

export async function smoke(docker, id, image, origin) {
  // Compose interpolation is exercised with an immutable image reference.
  const previousImage = process.env.PROJECT_ROUTER_IMAGE
  process.env.PROJECT_ROUTER_IMAGE = `ghcr.io/danilfaritovich/project-router@sha256:${'a'.repeat(64)}`
  let config
  try {
    config = JSON.parse(
      docker('compose', '-f', 'compose.yaml', 'config', '--format', 'json'),
    )
  } finally {
    if (previousImage === undefined) delete process.env.PROJECT_ROUTER_IMAGE
    else process.env.PROJECT_ROUTER_IMAGE = previousImage
  }
  assert.deepEqual(Object.keys(config.services), ['project-router'])
  const service = config.services['project-router']
  assert.equal(service.ports?.length || 0, 0)
  assert.match(service.image, /@sha256:[a-f0-9]{64}$/)
  assert.equal(service.restart, 'unless-stopped')
  assert.deepEqual(service.expose, ['8080'])
  assert.deepEqual(service.networks['portfolio-proxy'].aliases, [
    'project-router',
  ])
  assert.equal(config.networks['portfolio-proxy'].external, true)
  assert.equal(config.networks['portfolio-proxy'].name, 'portfolio-proxy')
  assert.equal(service.read_only, true)

  const metadata = JSON.parse(docker('image', 'inspect', image))[0]
  assert.equal(metadata.Config.User, '101:101')
  assert.ok(
    metadata.Config.Healthcheck.Test.join(' ').includes(
      'http://127.0.0.1:8080/en/',
    ),
  )
  await healthy(docker, id)
  assert.equal(docker('exec', id, 'id', '-u'), '101')
  // Check all live processes, including the Nginx master, rather than only exec's user.
  docker(
    'exec',
    id,
    'sh',
    '-ec',
    '! grep -lE "^Uid:[[:space:]]+0[[:space:]]" /proc/[0-9]*/status',
  )
  docker(
    'exec',
    id,
    'sh',
    '-ec',
    '! command -v node; ! command -v npm; test ! -e /app; test ! -e /usr/src/app; test ! -e /usr/local/lib/node_modules; test ! -e /usr/share/nginx/html/src; test ! -e /usr/share/nginx/html/node_modules; test ! -e /usr/share/nginx/html/package.json',
  )
  const binding = JSON.parse(docker('inspect', id))[0].NetworkSettings.Ports[
    '8080/tcp'
  ][0]
  assert.equal(binding.HostIp, '127.0.0.1')
  let base = `http://127.0.0.1:${binding.HostPort}`
  const request = (path) =>
    globalThis.fetch(`${base}${path}`, {
      redirect: 'manual',
      signal: globalThis.AbortSignal.timeout(5000),
    })
  const get = async (path, type) => {
    const response = await request(path)
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), type, path)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    return response
  }
  const root = await request('/?source=test')
  assert.equal(root.status, 302)
  assert.equal(root.headers.get('location'), '/en/?source=test')
  const assets = new Set([
    '/social/portfolio-en.png',
    '/social/portfolio-ru.png',
  ])
  for (const locale of ['en', 'ru']) {
    const response = await get(`/${locale}/`, /text\/html/)
    assert.equal(response.headers.get('cache-control'), 'no-cache')
    const document = new JSDOM(await response.text()).window.document
    assert.equal(document.documentElement.lang, locale)
    assert.match(
      document.querySelector('h1').textContent,
      locale === 'en' ? /Danil/ : /Данил/,
    )
    assert.equal(
      document.querySelector('link[rel="canonical"]')?.href,
      origin ? `${origin}/${locale}/` : undefined,
    )
    assert.equal(
      document.querySelectorAll('link[hreflang]').length,
      origin ? 3 : 0,
    )
    if (origin) {
      for (const [language, path] of Object.entries({
        en: '/en/',
        ru: '/ru/',
        'x-default': '/en/',
      })) {
        assert.equal(
          document.querySelector(`link[hreflang="${language}"]`).href,
          `${origin}${path}`,
        )
      }
      for (const selector of [
        'meta[property="og:url"]',
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
      ]) {
        assert.ok(document.querySelector(selector).content.startsWith(origin))
      }
      assert.equal(
        JSON.parse(
          document.querySelector('script[type="application/ld+json"]')
            .textContent,
        )['@context'],
        'https://schema.org',
      )
    } else {
      assert.equal(
        document.querySelector('script[type="application/ld+json"]'),
        null,
      )
      assert.equal(document.querySelector('meta[property="og:url"]'), null)
      assert.equal(document.querySelector('meta[property="og:image"]'), null)
      assert.equal(document.querySelector('meta[name="twitter:image"]'), null)
    }
    for (const element of document.querySelectorAll(
      'script[src], link[rel="stylesheet"], img[src]',
    )) {
      assets.add(element.getAttribute('src') || element.getAttribute('href'))
    }
  }
  for (const path of [
    '/unknown',
    '/en/unknown/',
    '/assets/missing.js',
    '/resumes/missing.pdf',
    '/.git/config',
    '/404.html',
  ]) {
    const response = await request(path)
    assert.equal(response.status, 404, path)
    assert.match(await response.text(), /noindex/)
    assert.doesNotMatch(
      response.headers.get('cache-control') || '',
      /immutable/,
    )
  }
  for (const role of ['backend', 'ai', 'data']) {
    for (const locale of ['en', 'ru']) {
      const path = `/resumes/${role}-${locale}.pdf`
      const response = await get(path, /application\/pdf/)
      assert.equal(
        digest(Buffer.from(await response.arrayBuffer())),
        digest(await readFile(`public${path}`)),
        path,
      )
      assert.doesNotMatch(response.headers.get('cache-control'), /immutable/)
    }
  }
  // Fetch every emitted asset, including lazy PDF.js chunks and its worker.
  for (const path of docker(
    'exec',
    id,
    'find',
    '/usr/share/nginx/html/assets',
    '-type',
    'f',
  ).split('\n')) {
    assets.add(path.replace('/usr/share/nginx/html', ''))
  }
  for (const path of assets) {
    const type =
      path.endsWith('.js') || path.endsWith('.mjs')
        ? /javascript/
        : path.endsWith('.css')
          ? /text\/css/
          : path.endsWith('.pdf')
            ? /application\/pdf/
            : /image\//
    const response = await get(path, type)
    assert.ok((await response.arrayBuffer()).byteLength > 0, path)
    if (path.startsWith('/assets/'))
      assert.match(response.headers.get('cache-control'), /immutable/)
  }
  const robots = await (await get('/robots.txt', /text\/plain/)).text()
  if (origin) {
    assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
    const xml = await (await get('/sitemap.xml', /xml/)).text()
    const document = new JSDOM(xml, { contentType: 'application/xml' }).window
      .document
    assert.deepEqual(
      [...document.querySelectorAll('loc')].map((node) => node.textContent),
      [`${origin}/en/`, `${origin}/ru/`],
    )
  } else {
    assert.doesNotMatch(robots, /Sitemap:/)
    assert.equal((await request('/sitemap.xml')).status, 404)
  }
  docker('restart', id)
  await healthy(docker, id)
  // Docker can allocate a different ephemeral host port on restart.
  const restarted = JSON.parse(docker('inspect', id))[0].NetworkSettings.Ports[
    '8080/tcp'
  ][0]
  base = `http://127.0.0.1:${restarted.HostPort}`
  await get('/en/', /text\/html/)
  await get('/ru/', /text\/html/)
  console.log(
    `HTTP, non-root runtime, PDFs, ${assets.size} assets, SEO, health, restart and Compose passed (${origin || 'no origin'}).`,
  )
}
