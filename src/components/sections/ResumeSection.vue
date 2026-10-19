<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import {
  resumes,
  resumeAvailable,
  resumeUrl,
  type Resume,
  type ResumeLanguage,
} from '../../content/resumes'
import { useI18n } from 'vue-i18n'
import PortfolioSection from '../PortfolioSection.vue'
import UiAction from '../UiAction.vue'
const { t, locale } = useI18n()
const siteLanguage = computed<ResumeLanguage>(() =>
  locale.value === 'ru' ? 'ru' : 'en',
)
const ResumeModal = defineAsyncComponent(
  () => import('../resume/ResumeModal.vue'),
)
const selected = ref<Resume>()
const language = ref<ResumeLanguage>('en')
function show(resume: Resume) {
  language.value = siteLanguage.value
  selected.value = resume
}
</script>

<template>
  <PortfolioSection id="resume" prefix="resume"
    ><div class="card-list">
      <article
        v-for="version in resumes"
        :key="version.title"
        class="resume-card"
      >
        <div>
          <h3>{{ t(version.title) }}</h3>
          <p class="stack">{{ t(version.stack) }}</p>
        </div>
        <div class="card-actions">
          <UiAction
            :disabled="!resumeAvailable(version.id, siteLanguage)"
            :aria-describedby="
              !resumeAvailable(version.id, siteLanguage)
                ? 'pdf-unavailable'
                : undefined
            "
            @click="show(version)"
            >{{ t('viewPdf') }}</UiAction
          >
          <UiAction
            primary
            :href="resumeUrl(version.id, siteLanguage)"
            :download="`${version.id}-${siteLanguage}.pdf`"
            :disabled="!resumeAvailable(version.id, siteLanguage)"
            :aria-describedby="
              !resumeAvailable(version.id, siteLanguage)
                ? 'pdf-unavailable'
                : undefined
            "
            >{{ t('downloadPdf') }}</UiAction
          >
        </div>
      </article>
    </div>
    <p
      v-if="
        resumes.some((version) => !resumeAvailable(version.id, siteLanguage))
      "
      id="pdf-unavailable"
      class="section-intro pdf-note"
    >
      {{ t('pdfUnavailable') }}
    </p></PortfolioSection
  >
  <ResumeModal
    v-if="selected"
    :resume="selected"
    :initial-language="language"
    @close="selected = undefined"
  />
</template>
