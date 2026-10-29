import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseSiteOrigin } from './src/seo/origin.ts'

export default defineConfig(({ mode }) => {
  const origin = parseSiteOrigin(
    loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_ORIGIN,
  )
  return {
    plugins: [vue(), tailwindcss()],
    ssgOptions: {
      dirStyle: 'nested',
      includedRoutes: () => [
        '/en/',
        '/ru/',
        '/en/deploy-test/',
        '/ru/deploy-test/',
      ],
      async onFinished() {
        // Root redirect also works without JavaScript on a plain static host.
        await writeFile(
          resolve('dist/index.html'),
          '<!doctype html><html lang="en"><head><meta charset="UTF-8"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/en/"><title>ProjectRouter</title></head><body><a href="/en/">Continue in English</a></body></html>',
        )
        await writeFile(
          resolve('dist/404.html'),
          '<!doctype html><html lang="en"><head><meta charset="UTF-8"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"><meta name="robots" content="noindex"><title>Page not found</title></head><body><h1>Page not found</h1><a href="/en/">ProjectRouter</a></body></html>',
        )
        const escapeXml = (value: string) =>
          value
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll("'", '&apos;')
        if (origin) {
          const urls = ['en', 'ru']
            .map(
              (locale) =>
                `<url><loc>${escapeXml(origin)}/${locale}/</loc></url>`,
            )
            .join('')
          await writeFile(
            resolve('dist/sitemap.xml'),
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          )
        }
        await writeFile(
          resolve('dist/robots.txt'),
          `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`,
        )
      },
    },
  }
})
