<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { socialLinks } from '../content/portfolio'
import UiAction from './UiAction.vue'
defineProps<{ buttons?: boolean }>()
const { t } = useI18n()
</script>

<template>
  <div class="social-links" :class="{ 'social-buttons': buttons }">
    <template v-for="link in socialLinks" :key="link.label">
      <UiAction
        v-if="buttons"
        :href="link.href"
        :primary="link.label === 'telegram'"
        >{{ t(link.label) }}</UiAction
      >
      <a v-else :href="link.href">{{ t(link.label) }}</a>
    </template>
  </div>
</template>
