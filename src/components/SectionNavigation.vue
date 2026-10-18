<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { sections, sectionLabel, type SectionId } from '../content/portfolio'
defineProps<{ active: SectionId }>()
defineEmits<{ navigate: [id: SectionId] }>()
const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <nav :aria-label="t('navigation')" class="section-navigation">
    <RouterLink
      v-for="id in sections"
      :key="id"
      :to="{ path: route.path, query: route.query, hash: `#${id}` }"
      :aria-current="active === id ? 'location' : undefined"
      @click="$emit('navigate', id)"
      >{{ t(sectionLabel[id]) }}</RouterLink
    >
  </nav>
</template>
