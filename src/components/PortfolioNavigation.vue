<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
import SectionNavigation from './SectionNavigation.vue'
import { useActiveSection } from '../composables/useActiveSection'
import type { SectionId } from '../content/portfolio'
const { t } = useI18n()
const route = useRoute()
const active = useActiveSection()
const open = ref(false)
const trigger = ref<HTMLButtonElement>()
const panel = ref<HTMLElement>()
const closer = ref<HTMLButtonElement>()
let previousOverflow = ''
async function show() {
  open.value = true
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document
    .querySelectorAll<HTMLElement>('.desktop-rail, .mobile-topbar, #main')
    .forEach((el) => {
      el.inert = true
    })
  await nextTick()
  closer.value?.focus()
}
function close(restore = true) {
  if (!open.value) return
  open.value = false
  document.body.style.overflow = previousOverflow
  document
    .querySelectorAll<HTMLElement>('.desktop-rail, .mobile-topbar, #main')
    .forEach((el) => {
      el.inert = false
    })
  if (restore) trigger.value?.focus()
}
async function navigate(id: SectionId) {
  close(false)
  await nextTick()
  document.getElementById(`${id}-heading`)?.focus({ preventScroll: true })
}
function onKey(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab') return
  const items = panel.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])',
  )
  if (!items?.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
function onResize() {
  if (window.innerWidth >= 768) close(false)
}
watch(
  () => route.path,
  () => close(),
)
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  close(false)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <a href="#main" class="skip-link">{{ t('skip') }}</a>
  <aside class="desktop-rail">
    <a :href="`${route.path}#hero`" class="brand" aria-label="ProjectRouter"
      >DM.</a
    >
    <p class="rail-label">{{ t('portfolio') }}</p>
    <SectionNavigation :active="active" />
    <p class="rail-label">{{ t('languageLabel') }}</p>
    <LanguageSwitcher :section="active" />
    <p class="rail-location">{{ t('location') }}</p>
  </aside>
  <header class="mobile-topbar">
    <a :href="`${route.path}#hero`" class="brand" aria-label="ProjectRouter"
      >DM.</a
    >
    <LanguageSwitcher :section="active" />
    <button
      ref="trigger"
      class="action menu-trigger"
      type="button"
      :aria-expanded="open"
      aria-controls="mobile-menu"
      aria-haspopup="dialog"
      @click="show"
    >
      {{ t('menu') }}
    </button>
  </header>
  <div v-if="open" class="menu-backdrop" @click.self="close()">
    <div
      id="mobile-menu"
      ref="panel"
      class="menu-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      <div class="menu-heading">
        <h2 id="menu-title">{{ t('explore') }}</h2>
        <button ref="closer" class="action" type="button" @click="close()">
          {{ t('closeMenu') }}
        </button>
      </div>
      <SectionNavigation :active="active" @navigate="navigate" />
      <div class="menu-language">
        <span class="eyebrow">{{ t('languageLabel') }}</span
        ><LanguageSwitcher :section="active" @navigate="close()" />
      </div>
    </div>
  </div>
</template>
