<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { pageMetadata } from './seo/metadata'
import { structuredDataHead } from './seo/structuredData'
const { locale } = useI18n()
useHead(() => {
  const language = locale.value === 'ru' ? 'ru' : 'en'
  const origin = import.meta.env.VITE_SITE_ORIGIN
  return {
    ...pageMetadata(language, origin),
    ...structuredDataHead(language, origin),
  }
})
</script>

<template>
  <RouterView />
</template>
