<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PortfolioItem } from '../content/portfolio'
import UiAction from './UiAction.vue'
defineProps<{ item: PortfolioItem; tool?: boolean }>()
const { t, te } = useI18n()
</script>

<template>
  <article
    class="portfolio-card"
    :class="{
      'featured-card': item.preview,
      'emphasized-card': item.emphasized,
      'tool-card': tool,
    }"
  >
    <div class="card-copy">
      <p v-if="tool && item.emphasized" class="eyebrow">
        {{ t('featuredTool') }}
      </p>
      <h3>{{ t(`${item.id}Title`) }}</h3>
      <p class="card-summary desktop-copy">{{ t(`${item.id}Summary`) }}</p>
      <p v-if="item.preview" class="card-detail desktop-copy">
        {{ t(`${item.id}Detail`) }}
      </p>
      <p class="card-summary mobile-copy">
        {{
          t(
            te(`${item.id}SummaryMobile`)
              ? `${item.id}SummaryMobile`
              : `${item.id}Summary`,
          )
        }}
      </p>
      <p v-if="item.preview" class="card-detail mobile-copy">
        {{ t(`${item.id}DetailMobile`) }}
      </p>
      <p v-if="!item.preview" class="stack">{{ t(item.stack) }}</p>
    </div>
    <div v-if="item.preview" class="project-preview" aria-hidden="true">
      <span class="preview-category">{{ t(`${item.id}Category`) }}</span>
      <span class="preview-monogram">{{ item.preview }}</span>
      <span class="preview-caption">{{ t(`${item.id}Caption`) }}</span>
    </div>
    <p v-if="item.preview" class="stack featured-stack">{{ t(item.stack) }}</p>
    <div class="card-actions">
      <UiAction :href="item.repository">{{ t('github') }}</UiAction>
      <UiAction
        v-if="item.release"
        :href="`${item.repository}/releases/latest`"
        >{{ t('release') }}</UiAction
      >
    </div>
  </article>
</template>
