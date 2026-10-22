<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
const { t } = useI18n()
</script>

<template>
  <PortfolioSection id="about" prefix="about">
    <div class="about-copy">
      <p class="about-introduction">{{ t('aboutIntroduction') }}</p>
      <div class="about-block">
        <h3>{{ t('experienceTitle') }}</h3>
        <p>{{ t('experience') }}</p>
        <p>{{ t('experienceDetail') }}</p>
      </div>
      <div class="about-block">
        <h3>{{ t('freelanceTitle') }}</h3>
        <p>{{ t('freelance') }}</p>
        <p>{{ t('freelanceDetail') }}</p>
      </div>
      <div class="about-block">
        <h3>{{ t('personalTitle') }}</h3>
        <p>{{ t('personal') }}</p>
        <p>{{ t('personalDetail') }}</p>
      </div>
      <aside class="focus-panel" aria-labelledby="focus-heading">
        <h3 id="focus-heading" class="eyebrow">{{ t('focusTitle') }}</h3>
        <p>{{ t('focus') }}</p>
      </aside>
    </div>
  </PortfolioSection>
</template>
