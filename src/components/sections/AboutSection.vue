<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="about" prefix="about">
    <div class="about-copy">
      <h3>{{ t('experienceTitle') }}</h3>
      <p>{{ t('experience') }}</p>
      <p class="muted">{{ t('experienceDetail') }}</p>
      <h3>{{ t('personalTitle') }}</h3>
      <p>{{ t('personal') }}</p>
      <aside class="focus-panel">
        <p class="eyebrow">{{ t('focusTitle') }}</p>
        <p>{{ t('focus') }}</p>
      </aside>
    </div>
  </PortfolioSection>
</template>
