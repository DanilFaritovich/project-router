<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { locales, localePath } from '../locales'
const { t, locale } = useI18n()
const route = useRoute()
defineProps<{ section?: string }>()
defineEmits<{ navigate: [] }>()
</script>

<template>
  <nav :aria-label="t('language')" class="language-switcher">
    <span class="language-globe" aria-hidden="true">⊕</span>
    <RouterLink
      v-for="language in locales"
      :key="language"
      :to="{
        path: localePath(language),
        query: route.query,
        hash: section ? (section === 'hero' ? '' : `#${section}`) : route.hash,
      }"
      :lang="language"
      :hreflang="language"
      :aria-label="t(language === 'en' ? 'english' : 'russian')"
      :aria-current="locale === language ? 'page' : undefined"
      @click="$emit('navigate')"
      >{{ language.toUpperCase() }}</RouterLink
    >
  </nav>
</template>
