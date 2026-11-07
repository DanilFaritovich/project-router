<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, useId } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const titleId = useId()
const dialog = ref<HTMLDialogElement>()
let opener: HTMLElement | null = null
let overflow = ''
function release() {
  document.body.style.overflow = overflow
  if (opener?.isConnected) opener.focus({ preventScroll: true })
  opener = null
}
function containFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const items = dialog.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])',
  )
  if (!items?.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
function sync() {
  if (props.open && !dialog.value?.open) {
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    overflow = document.body.style.overflow
    dialog.value?.showModal()
    document.body.style.overflow = 'hidden'
  } else if (!props.open && dialog.value?.open) {
    dialog.value.close()
    release()
  }
}
function closed() {
  release()
  emit('close')
}
watch(() => props.open, sync)
onMounted(sync)
onBeforeUnmount(() => {
  if (dialog.value?.open) {
    dialog.value.close()
    release()
  }
})
</script>

<template>
  <dialog
    ref="dialog"
    class="freelance-dialog"
    :aria-labelledby="titleId"
    @close="closed"
    @keydown="containFocus"
    @click="$event.target === dialog && emit('close')"
  >
    <div class="freelance-dialog-heading">
      <h2 :id="titleId">{{ title }}</h2>
      <button class="action" type="button" autofocus @click="emit('close')">
        {{ t('servicesPage.close') }}
      </button>
    </div>
    <slot />
  </dialog>
</template>
