<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { socialLinks } from '../content/portfolio'
import UiAction from './UiAction.vue'
const props = defineProps<{
  buttons?: boolean
  section?: 'hero' | 'contacts'
}>()
const links = computed(() =>
  socialLinks.filter(
    (link) => !('contactsOnly' in link) || props.section === 'contacts',
  ),
)
const { t } = useI18n()
</script>

<template>
  <div class="social-links" :class="{ 'social-buttons': buttons }">
    <template v-for="link in links" :key="link.label">
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
