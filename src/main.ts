import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { createAppI18n } from './locales'
import { routes, installLocaleRouting } from './router'
import './styles/main.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 100 }
      if (to.path !== from.path) return { top: 0 }
    },
  },
  ({ app, router }) => {
    const i18n = createAppI18n()
    app.use(i18n)
    installLocaleRouting(router, i18n)
  },
  { hydration: true },
)
