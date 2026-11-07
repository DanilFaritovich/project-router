import type { RouteRecordRaw, Router } from 'vue-router'
import {
  locales,
  localePath,
  localeFromPath,
  type createAppI18n,
} from '../locales'
import PortfolioView from '../views/PortfolioView.vue'
import FreelanceView from '../views/FreelanceView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/en/' },
  ...locales.map((locale) => ({
    path: localePath(locale),
    component: PortfolioView,
  })),
  ...locales.map((locale) => ({
    path: `${localePath(locale)}freelance/`,
    component: FreelanceView,
    meta: { page: 'freelance' },
  })),
]

export function installLocaleRouting(
  router: Router,
  i18n: ReturnType<typeof createAppI18n>,
) {
  router.afterEach((to, _from, failure) => {
    // Let Router save the outgoing scroll position before translated copy reflows.
    if (!failure) i18n.global.locale.value = localeFromPath(to.path)
  })
}
