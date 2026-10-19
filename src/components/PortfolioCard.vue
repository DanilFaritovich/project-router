<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PortfolioItem } from '../content/projects'
import UiAction from './UiAction.vue'
defineProps<{ item: PortfolioItem; tool?: boolean }>()
const { t } = useI18n()
const failedImageSrc = ref<string>()
</script>

<template>
  <article
    :id="`project-${item.id}`"
    :aria-labelledby="`project-${item.id}-title`"
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
      <h3 :id="`project-${item.id}-title`">{{ t(`${item.id}Title`) }}</h3>
      <p class="card-summary">{{ t(`${item.id}Summary`) }}</p>
      <p class="card-detail">
        {{ t(`${item.id}Detail`) }}
      </p>
      <img
        v-if="!item.preview && item.image && failedImageSrc !== item.image.src"
        :src="item.image.src"
        :alt="t(item.image.altKey)"
        :width="item.image.width"
        :height="item.image.height"
        class="project-screenshot compact-screenshot"
        loading="lazy"
        decoding="async"
        @error="failedImageSrc = item.image?.src"
      />
      <p v-if="!item.preview" class="stack">{{ item.stack.join(' · ') }}</p>
    </div>
    <div v-if="item.preview" class="project-preview">
      <span class="preview-category">{{ t(`${item.id}Category`) }}</span>
      <img
        v-if="item.image && failedImageSrc !== item.image.src"
        :src="item.image.src"
        :alt="t(item.image.altKey)"
        :width="item.image.width"
        :height="item.image.height"
        class="project-screenshot"
        loading="lazy"
        decoding="async"
        @error="failedImageSrc = item.image?.src"
      />
      <span v-else class="preview-monogram" aria-hidden="true">{{
        item.preview
      }}</span>
      <span class="preview-caption">{{ t(`${item.id}Caption`) }}</span>
    </div>
    <p v-if="item.preview" class="stack featured-stack">
      {{ item.stack.join(' · ') }}
    </p>
    <div class="card-actions">
      <UiAction :href="item.repositoryUrl">{{ t('github') }}</UiAction>
      <UiAction v-if="item.releaseUrl" :href="item.releaseUrl">{{
        t('release')
      }}</UiAction>
    </div>
  </article>
</template>
