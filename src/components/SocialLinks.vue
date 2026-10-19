<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationQuery } from '../composables/useNavigationQuery'
import { useI18n } from 'vue-i18n'
import {
  contactSocialGroups,
  heroSocialOrder,
  socialLinks,
} from '../content/portfolio'
import UiAction from './UiAction.vue'
const props = defineProps<{
  buttons?: boolean
  group?: keyof typeof contactSocialGroups
}>()
const links = computed(() => {
  const order = props.group ? contactSocialGroups[props.group] : heroSocialOrder
  return order.map((label) => socialLinks.find((link) => link.label === label)!)
})
const { t } = useI18n()
const route = useRoute()
const query = useNavigationQuery()
async function focusContacts(event: MouseEvent) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  await nextTick()
  document.getElementById('contacts-heading')?.focus({ preventScroll: true })
}
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
    <RouterLink
      v-if="!group"
      :to="{ path: route.path, query, hash: '#contacts' }"
      @click="focusContacts"
      >{{ t('heroContact') }}</RouterLink
    >
  </div>
</template>
