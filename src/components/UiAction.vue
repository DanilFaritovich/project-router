<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  href?: string
  primary?: boolean
  disabled?: boolean
}>()
const external = computed(() => /^(https?:)?\/\//i.test(props.href ?? ''))
</script>

<template>
  <a
    v-if="href && !disabled"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="action"
    :class="{ 'action-primary': primary }"
    ><slot
  /></a>
  <button
    v-else
    type="button"
    class="action"
    :class="{ 'action-primary': primary }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
