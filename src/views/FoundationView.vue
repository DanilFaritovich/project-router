<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
const { t } = useI18n()
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 px-6 py-12">
    <LanguageSwitcher />
    <h1 class="text-3xl font-bold">{{ t('heading') }}</h1>
    <p>{{ t('intro') }}</p>
    <p>{{ t('status') }}</p>
  </main>
</template>
