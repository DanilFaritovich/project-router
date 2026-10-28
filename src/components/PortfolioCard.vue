<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PortfolioItem } from '../content/projects'
import UiAction from './UiAction.vue'
const props = defineProps<{ item: PortfolioItem; tool?: boolean }>()
const { t } = useI18n()
const failedImageSrc = ref<string>()
const hasImage = computed(
  () => props.item.image && failedImageSrc.value !== props.item.image.src,
)
</script>

<template>
  <article
    :id="`project-${item.id}`"
    :aria-labelledby="`project-${item.id}-title`"
    class="portfolio-card"
    :class="{
      'featured-card': item.preview,
      'media-card': hasImage,
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
      <p v-if="item.statusKey" class="card-status">{{ t(item.statusKey) }}</p>
    </div>
    <p class="stack">{{ item.stack.join(' · ') }}</p>
    <div v-if="hasImage && item.image" class="project-preview">
      <span v-if="item.preview" class="preview-category">{{
        t(`${item.id}Category`)
      }}</span>
      <img
        :src="item.image.src"
        :alt="t(item.image.altKey)"
        :width="item.image.width"
        :height="item.image.height"
        class="project-screenshot"
        loading="lazy"
        decoding="async"
        @error="failedImageSrc = item.image?.src"
      />
      <span v-if="item.preview" class="preview-caption">{{
        t(`${item.id}Caption`)
      }}</span>
    </div>
    <div class="card-actions">
      <UiAction :href="item.repositoryUrl">{{
        t(item.repositoryLabel ?? 'github')
      }}</UiAction>
      <UiAction
        v-for="source in item.relatedSources"
        :key="source.href"
        :href="source.href"
        >{{ t(source.label) }}</UiAction
      >
      <UiAction v-if="item.releaseUrl" :href="item.releaseUrl">{{
        t(item.releaseLabel ?? 'release')
      }}</UiAction>
    </div>
  </article>
</template>
