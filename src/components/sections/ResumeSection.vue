<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import {
  loadResumeModal,
  prepareResumeOnIntent,
  scheduleResumePreparation,
} from '../../pdf/prepareResumes'
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
const ResumeModal = defineAsyncComponent(loadResumeModal)
let cancelPreparation: (() => void) | undefined
let stopLanguageWatch: (() => void) | undefined
onMounted(() => {
  stopLanguageWatch = watch(
    siteLanguage,
    (language) => {
      cancelPreparation?.()
      cancelPreparation = scheduleResumePreparation(language)
    },
    { immediate: true },
  )
})
onUnmounted(() => {
  stopLanguageWatch?.()
  cancelPreparation?.()
})
const selected = ref<Resume>()
const language = ref<ResumeLanguage>('en')
function show(resume: Resume) {
  prepare(resume)
  language.value = siteLanguage.value
  selected.value = resume
}
function prepare(resume: Resume) {
  if (resumeAvailable(resume.id, siteLanguage.value))
    prepareResumeOnIntent(resumeUrl(resume.id, siteLanguage.value))
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
            @pointerenter="prepare(version)"
            @focus="prepare(version)"
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
