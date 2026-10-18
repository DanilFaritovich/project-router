<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { pageMetadata } from './seo/metadata'
const { locale } = useI18n()
useHead(() =>
  pageMetadata(
    locale.value === 'ru' ? 'ru' : 'en',
    import.meta.env.VITE_SITE_ORIGIN,
  ),
)
</script>

<template>
  <RouterView />
</template>
