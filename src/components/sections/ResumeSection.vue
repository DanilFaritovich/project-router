<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
import UiAction from '../UiAction.vue'
const { t } = useI18n()
const versions = [
  { title: 'resumeBackend', stack: 'resumeBackendStack' },
  { title: 'resumeAi', stack: null },
  { title: 'resumeData', stack: 'resumeDataStack' },
]
</script>

<template>
  <PortfolioSection id="resume" prefix="resume"
    ><div class="card-list">
      <article
        v-for="version in versions"
        :key="version.title"
        class="resume-card"
      >
        <div>
          <h3>{{ t(version.title) }}</h3>
          <p class="stack">{{ t(version.stack ?? 'resumeAiStack') }}</p>
        </div>
        <div class="card-actions" aria-describedby="pdf-unavailable">
          <UiAction disabled aria-describedby="pdf-unavailable">{{
            t('viewPdf')
          }}</UiAction
          ><UiAction primary disabled aria-describedby="pdf-unavailable">{{
            t('downloadPdf')
          }}</UiAction>
        </div>
      </article>
    </div>
    <p id="pdf-unavailable" class="section-intro pdf-note">
      {{ t('pdfUnavailable') }}
    </p></PortfolioSection
  >
</template>
