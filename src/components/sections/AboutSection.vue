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
      <div class="experience-cases">
        <h3>{{ t('commercialCasesTitle') }}</h3>
        <dl>
          <div v-for="id in ['batch', 'stock', 'translation']" :key="id">
            <dt>{{ t(`${id}CaseTitle`) }}</dt>
            <dd>{{ t(`${id}CaseDetail`) }}</dd>
          </div>
        </dl>
      </div>
      <aside class="focus-panel" aria-labelledby="focus-heading">
        <h3 id="focus-heading" class="eyebrow">{{ t('focusTitle') }}</h3>
        <p>{{ t('focus') }}</p>
      </aside>
    </div>
  </PortfolioSection>
</template>

<style scoped>
.experience-cases {
  margin-top: 28px;
}
dl > div {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-line);
}
dt {
  font-size: 15px;
  font-weight: 600;
}
dd {
  margin: 8px 0 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.6;
}
</style>
