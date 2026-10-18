<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactSocialOrder, socialLinks } from '../content/portfolio'
import UiAction from './UiAction.vue'
const props = defineProps<{
  buttons?: boolean
  section?: 'hero' | 'contacts'
}>()
const links = computed(() => {
  const visible = socialLinks.filter(
    (link) => !('contactsOnly' in link) || props.section === 'contacts',
  )
  return props.section === 'contacts'
    ? visible.sort(
        (a, b) =>
          contactSocialOrder.indexOf(a.label) -
          contactSocialOrder.indexOf(b.label),
      )
    : visible
})
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
