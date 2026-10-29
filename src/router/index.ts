import type { RouteRecordRaw, Router } from 'vue-router'
import {
  locales,
  localePath,
  localeFromPath,
  type createAppI18n,
} from '../locales'
import PortfolioView from '../views/PortfolioView.vue'
import DeployTestView from '../views/DeployTestView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/en/' },
  ...locales.map((locale) => ({
    path: localePath(locale),
    component: PortfolioView,
  })),
  ...locales.map((locale) => ({
    path: `${localePath(locale)}deploy-test/`,
    component: DeployTestView,
    meta: { noindex: true },
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
