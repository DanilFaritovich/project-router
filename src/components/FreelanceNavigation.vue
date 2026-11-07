<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
import FreelanceDialog from './FreelanceDialog.vue'
const { t, locale } = useI18n()
const route = useRoute()
const open = ref(false)
const links = computed(() => [
  { href: '#services', text: t('servicesPage.services') },
  { href: '#cases', text: t('servicesPage.cases') },
  { href: '#pricing', text: t('servicesPage.pricing') },
])
function resize() {
  if (window.innerWidth >= 1000) open.value = false
}
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
onMounted(() => window.addEventListener('resize', resize))
onBeforeUnmount(() => window.removeEventListener('resize', resize))
function navigate(event: MouseEvent) {
  if (!(event.target instanceof HTMLAnchorElement)) return
  open.value = false
  const id = event.target.hash.slice(1)
  if (id)
    requestAnimationFrame(() =>
      document.getElementById(`${id}-heading`)?.focus({ preventScroll: true }),
    )
}
</script>

<template>
  <a href="#main" class="skip-link">{{ t('skip') }}</a>
  <div class="freelance-header-shell">
    <header class="freelance-header freelance-container">
      <a href="#main" class="brand" aria-label="ProjectRouter">DM.</a>
      <nav
        class="freelance-desktop-links"
        :aria-label="t('servicesPage.navigation')"
      >
        <a v-for="link in links" :key="link.href" :href="link.href">{{
          link.text
        }}</a>
      </nav>
      <LanguageSwitcher />
      <a class="action primary freelance-header-cta" href="#contacts">{{
        t('servicesPage.discuss')
      }}</a>
      <div class="freelance-portfolio-switch">
        <RouterLink class="action freelance-portfolio-link" :to="`/${locale}/`"
          >{{ t('portfolio') }}<span aria-hidden="true">→</span></RouterLink
        >
      </div>
      <button
        class="action freelance-menu-trigger"
        type="button"
        :aria-expanded="open"
        aria-haspopup="dialog"
        @click="open = true"
      >
        {{ t('menu') }}
      </button>
    </header>
  </div>
  <FreelanceDialog :open="open" :title="t('menu')" @close="open = false">
    <nav
      class="freelance-menu-links"
      :aria-label="t('servicesPage.navigation')"
      @click="navigate"
    >
      <a v-for="link in links" :key="link.href" :href="link.href">{{
        link.text
      }}</a>
      <a href="#faq">{{ t('servicesPage.faq') }}</a>
      <a class="action primary" href="#contacts">{{
        t('servicesPage.discuss')
      }}</a>
    </nav>
    <div class="freelance-portfolio-switch">
      <RouterLink
        class="action freelance-portfolio-link"
        :to="`/${locale}/`"
        @click="open = false"
        >{{ t('portfolio') }}<span aria-hidden="true">→</span></RouterLink
      >
    </div>
    <LanguageSwitcher @navigate="open = false" />
  </FreelanceDialog>
</template>
