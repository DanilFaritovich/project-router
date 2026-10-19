<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactSocialGroups, socialLinks } from '../content/portfolio'
import UiAction from './UiAction.vue'
const props = defineProps<{
  buttons?: boolean
  group?: keyof typeof contactSocialGroups
}>()
const links = computed(() => {
  if (props.group) {
    const order = contactSocialGroups[props.group]
    return order.map((label) =>
      socialLinks.find((link) => link.label === label)!,
    )
  }
  return socialLinks.filter((link) => !('contactsOnly' in link))
})
const { t } = useI18n()
</script>

<template>
  <div class="social-links" :class="{ 'social-buttons': buttons }">
    <template v-for="link in links" :key="link.label">
      <UiAction
        v-if="buttons"
        :href="link.href"
        :primary="link.label === 'email'"
        >{{ t(link.label) }}</UiAction
      >
      <a v-else :href="link.href" target="_blank" rel="noopener noreferrer"
        >{{ t(link.label)
        }}<span
          v-if="group === 'profiles'"
          class="external-indicator"
          aria-hidden="true"
          >↗</span
        ></a
      >
    </template>
  </div>
</template>
