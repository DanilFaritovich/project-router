<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { locales, localePath } from '../locales'
const { t, locale } = useI18n()
const route = useRoute()
</script>

<template>
  <nav :aria-label="t('language')" class="flex gap-4">
    <RouterLink
      v-for="language in locales"
      :key="language"
      :to="{ path: localePath(language), query: route.query, hash: route.hash }"
      :lang="language"
      :hreflang="language"
      :aria-current="locale === language ? 'page' : undefined"
      class="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
      >{{ language === 'en' ? 'English' : 'Русский' }}</RouterLink
    >
  </nav>
</template>
