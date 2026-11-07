<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { pageMetadata } from './seo/metadata'
import { structuredDataHead } from './seo/structuredData'
const { locale } = useI18n()
const route = useRoute()
useHead(() => {
  const language = locale.value === 'ru' ? 'ru' : 'en'
  const origin = import.meta.env.VITE_SITE_ORIGIN
  return {
    ...pageMetadata(
      language,
      origin,
      route.meta.page === 'freelance' ? 'freelance' : 'portfolio',
    ),
    ...(route.meta.page === 'freelance'
      ? {}
      : structuredDataHead(language, origin)),
  }
})
</script>

<template>
  <RouterView />
</template>
