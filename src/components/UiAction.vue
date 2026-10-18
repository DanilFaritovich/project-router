<script setup lang="ts">
defineProps<{ href?: string; primary?: boolean; disabled?: boolean }>()
</script>

<template>
  <a
    v-if="href && !disabled"
    :href="href"
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
