<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SectionId } from '../content/portfolio'
defineProps<{ id: SectionId; prefix: string }>()
const { t } = useI18n()
</script>

<template>
  <section
    :id="id"
    class="portfolio-section"
    :aria-labelledby="`${id}-heading`"
  >
    <header class="section-heading">
      <p class="eyebrow">{{ t(`${prefix}Eyebrow`) }}</p>
      <h2 :id="`${id}-heading`" tabindex="-1">{{ t(`${prefix}Title`) }}</h2>
      <p
        class="section-intro"
        :class="{ 'desktop-copy': prefix === 'projects' }"
      >
        {{ t(`${prefix}Intro`) }}
      </p>
      <p v-if="prefix === 'projects'" class="section-intro mobile-copy">
        {{ t('projectsIntroMobile') }}
      </p>
    </header>
    <div class="section-content"><slot /></div>
  </section>
</template>
