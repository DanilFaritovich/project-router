import type { RouteRecordRaw, Router } from 'vue-router'
import {
  locales,
  localePath,
  localeFromPath,
  type createAppI18n,
} from '../locales'
import PortfolioView from '../views/PortfolioView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/en/' },
  ...locales.map((locale) => ({
    path: localePath(locale),
    component: PortfolioView,
  })),
]

export function installLocaleRouting(
  router: Router,
  i18n: ReturnType<typeof createAppI18n>,
) {
  router.beforeEach((to) => {
    i18n.global.locale.value = localeFromPath(to.path)
  })
}
