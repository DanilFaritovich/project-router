import { defineConfig } from '@playwright/test'
import process from 'node:process'

const port = Number(process.env.PLAYWRIGHT_PORT || 4173)
const baseURL = `http://127.0.0.1:${port}`
export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: { baseURL, browserName: 'chromium' },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `${baseURL}/en/`,
    reuseExistingServer: false,
  },
})
