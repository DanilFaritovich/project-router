<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  AnnotationLayer,
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from 'pdfjs-dist'
import {
  resumeUrl,
  type Resume,
  type ResumeLanguage,
} from '../../content/resumes'
import { loadPdf } from '../../pdf/loadPdf'
import { createLinkAnnotations } from '../../pdf/linkAnnotations'

const props = defineProps<{ resume: Resume; initialLanguage: ResumeLanguage }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const language = ref(props.initialLanguage)
const url = computed(() => resumeUrl(props.resume.id, language.value))
const dialog = ref<HTMLDialogElement>()
const closer = ref<HTMLButtonElement>()
const viewport = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const annotations = ref<HTMLElement>()
let linkLayer: AnnotationLayer | undefined
const state = ref<'loading' | 'ready' | 'error'>('loading')
const page = ref(1)
const pages = ref(0)
const zoom = ref(1)
const zoomMode = ref<'initial' | 'fit' | 'manual'>('initial')
const fit = ref(false)
let loading: PDFDocumentLoadingTask | undefined
let pdf: PDFDocumentProxy | undefined
let rendering: RenderTask | undefined
let generation = 0
let renderGeneration = 0
let disposed = false
let observer: ResizeObserver | undefined
let opener: HTMLElement | null = null
let previousOverflow = ''

function clearAnnotations() {
  if (annotations.value?.contains(document.activeElement))
    viewport.value?.focus()
  linkLayer?.destroy()
  linkLayer = undefined
  annotations.value?.replaceChildren()
}

function release() {
  clearAnnotations()
  rendering?.cancel()
  rendering = undefined
  pdf = undefined
  const task = loading
  loading = undefined
  return task?.destroy().catch(() => {})
}

async function renderPage() {
  const documentPdf = pdf
  if (!documentPdf || !canvas.value || !viewport.value) return
  const current = ++renderGeneration
  rendering?.cancel()
  clearAnnotations()
  state.value = 'loading'
  try {
    const pdfPage = await documentPdf.getPage(page.value)
    if (disposed || current !== renderGeneration) return
    const base = pdfPage.getViewport({ scale: 1 })
    const style = getComputedStyle(viewport.value)
    const availableWidth =
      viewport.value.clientWidth -
      (parseFloat(style.paddingLeft) || 0) -
      (parseFloat(style.paddingRight) || 0)
    const widthScale = Math.max(0.01, Math.floor(availableWidth) / base.width)
    const scale =
      zoomMode.value === 'manual'
        ? zoom.value
        : zoomMode.value === 'initial' && window.innerWidth > 600
          ? Math.min(1.25, widthScale)
          : widthScale
    fit.value = zoomMode.value !== 'manual' && scale === widthScale
    zoom.value = scale
    const view = pdfPage.getViewport({ scale })
    // Bound the bitmap allocation on small devices and at high zoom levels.
    const ratio = Math.min(
      window.devicePixelRatio || 1,
      2,
      4096 / Math.max(view.width, view.height),
    )
    const target = canvas.value
    target.width = Math.floor(view.width * ratio)
    target.height = Math.floor(view.height * ratio)
    target.style.width = `${view.width}px`
    target.style.height = `${view.height}px`
    rendering = pdfPage.render({
      canvas: target,
      viewport: view,
      transform: [ratio, 0, 0, ratio, 0, 0],
    })
    await rendering.promise
    if (disposed || current !== renderGeneration) return
    const layer = await createLinkAnnotations(pdfPage, view)
    if (disposed || current !== renderGeneration) {
      layer.destroy()
      return
    }
    linkLayer = layer
    annotations.value?.replaceChildren(layer.div)
    state.value = 'ready'
  } catch {
    if (!disposed && current === renderGeneration) state.value = 'error'
  }
}

async function openDocument() {
  const current = ++generation
  ++renderGeneration
  state.value = 'loading'
  pages.value = 0
  page.value = 1
  zoomMode.value = 'initial'
  await release()
  try {
    const task = await loadPdf(url.value)
    if (disposed || current !== generation) {
      await task.destroy()
      return
    }
    loading = task
    const result = await task.promise
    if (disposed || current !== generation) return
    pdf = result
    pages.value = result.numPages
    await renderPage()
  } catch {
    if (!disposed && current === generation) state.value = 'error'
  }
}
function changePage(delta: number) {
  page.value = Math.max(1, Math.min(pages.value, page.value + delta))
  viewport.value?.scrollTo?.(0, 0)
}
function fitWidth() {
  zoomMode.value = 'fit'
  void renderPage()
}
function changeZoom(delta: number) {
  zoomMode.value = 'manual'
  zoom.value = Math.max(0.25, Math.min(3, zoom.value + delta))
  void renderPage()
}
function onKey(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !dialog.value) return
  const items = Array.from(
    dialog.value.querySelectorAll<HTMLElement>('a, button, [tabindex]'),
  ).filter(
    (item) =>
      item.tabIndex >= 0 &&
      !item.hasAttribute('disabled') &&
      !item.closest('[hidden]'),
  )
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
watch(language, openDocument)
watch(page, renderPage)
onMounted(() => {
  opener = document.activeElement as HTMLElement | null
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value?.showModal()
  closer.value?.focus()
  observer = new ResizeObserver(() => {
    if (zoomMode.value !== 'manual') void renderPage()
  })
  if (viewport.value) observer.observe(viewport.value)
  void openDocument()
})
onUnmounted(() => {
  disposed = true
  ++generation
  ++renderGeneration
  observer?.disconnect()
  void release()
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  opener?.focus({ preventScroll: true })
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="resume-modal"
      aria-labelledby="resume-modal-title"
      aria-modal="true"
      @cancel.prevent="emit('close')"
      @keydown="onKey"
    >
      <header class="resume-modal-header">
        <h2 id="resume-modal-title">
          {{ t('resumeTitle') }} · {{ t(resume.title) }}
        </h2>
        <div class="card-actions">
          <a
            class="action action-primary"
            :href="url"
            :download="url.split('/').pop()"
            >{{ t('downloadPdf') }}</a
          >
          <button
            ref="closer"
            type="button"
            class="action"
            @click="emit('close')"
          >
            {{ t('pdfClose') }}
          </button>
        </div>
      </header>
      <div class="pdf-toolbar" :aria-label="t('pdfControls')" role="group">
        <div
          class="pdf-control-group"
          :aria-label="t('pdfLanguage')"
          role="group"
        >
          <button
            v-for="item in ['en', 'ru'] as const"
            :key="item"
            type="button"
            class="action"
            :aria-pressed="language === item"
            :lang="item"
            @click="language = item"
          >
            {{ item.toUpperCase() }}
          </button>
        </div>
        <div class="pdf-control-group">
          <button
            class="action"
            type="button"
            :aria-label="t('pdfPrevious')"
            :disabled="state !== 'ready' || page <= 1"
            @click="changePage(-1)"
          >
            ←
          </button>
          <span class="pdf-page-count" aria-live="polite">{{
            t('pdfPage', { page: pages ? page : '–', pages: pages || '–' })
          }}</span>
          <button
            class="action"
            type="button"
            :aria-label="t('pdfNext')"
            :disabled="state !== 'ready' || page >= pages"
            @click="changePage(1)"
          >
            →
          </button>
        </div>
        <div class="pdf-control-group">
          <button
            class="action"
            type="button"
            :aria-label="t('pdfZoomOut')"
            :disabled="state !== 'ready' || zoom <= 0.25"
            @click="changeZoom(-0.25)"
          >
            −
          </button>
          <span class="pdf-zoom">{{ Math.round(zoom * 100) }}%</span>
          <button
            class="action"
            type="button"
            :aria-label="t('pdfZoomIn')"
            :disabled="state !== 'ready' || zoom >= 3"
            @click="changeZoom(0.25)"
          >
            +
          </button>
          <button
            class="action"
            type="button"
            :aria-pressed="fit"
            :disabled="state !== 'ready'"
            @click="fitWidth"
          >
            {{ t('pdfFitWidth') }}
          </button>
        </div>
      </div>
      <div
        ref="viewport"
        class="pdf-viewport"
        tabindex="0"
        :aria-label="t('pdfDocument')"
        :aria-busy="state === 'loading'"
      >
        <p v-if="state === 'loading'" class="pdf-state" role="status">
          {{ t('pdfLoading') }}
        </p>
        <div v-if="state === 'error'" class="pdf-state" role="alert">
          <h3>{{ t('pdfError') }}</h3>
          <p>{{ t('pdfErrorHelp') }}</p>
          <button class="action" type="button" @click="openDocument">
            {{ t('pdfRetry') }}
          </button>
        </div>
        <div class="pdf-page" :hidden="state !== 'ready'">
          <canvas
            ref="canvas"
            role="img"
            :aria-label="t('pdfPage', { page, pages })"
            :lang="language"
          />
          <div ref="annotations" class="pdf-annotations" :lang="language" />
        </div>
      </div>
      <footer class="pdf-footer">
        <a class="action" :href="url" target="_blank" rel="noopener noreferrer"
          >{{ t('pdfOpenOriginal') }} ↗</a
        >
      </footer>
    </dialog>
  </Teleport>
</template>

<style scoped>
.resume-modal {
  width: min(1120px, calc(100% - 32px));
  max-width: none;
  height: min(860px, calc(100dvh - 32px));
  max-height: none;
  margin: auto;
  padding: 0;
  border: 1px solid var(--color-line);
  border-radius: 5px;
  background: var(--color-page);
  color: var(--color-ink);
  overflow: hidden;
}
.resume-modal[open] {
  display: flex;
  flex-direction: column;
}
.resume-modal::backdrop {
  background: rgb(24 24 24 / 40%);
}
.resume-modal-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  background: var(--color-surface);
}
.resume-modal-header .card-actions {
  flex-direction: row;
  flex-wrap: wrap;
}
.resume-modal-header .action {
  min-height: 44px;
}
.resume-modal h2 {
  font-size: 24px;
  overflow-wrap: anywhere;
}
.pdf-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px;
  border-block: 1px solid var(--color-line);
}
.pdf-control-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.pdf-toolbar .action {
  min-width: 44px;
  min-height: 44px;
  padding: 8px 12px;
}
.action[aria-pressed='true'] {
  background: var(--color-panel);
  border-color: var(--color-accent-ink);
}
.pdf-page-count,
.pdf-zoom {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.pdf-viewport {
  flex: 1;
  min-height: 80px;
  min-width: 0;
  overflow: auto;
  scrollbar-gutter: stable both-edges;
  overscroll-behavior: contain;
  padding: 16px;
}
.pdf-page {
  position: relative;
  width: max-content;
  margin-inline: auto;
}
.pdf-page[hidden] {
  display: none;
}
.pdf-annotations,
.pdf-annotations :deep(.pdf-link-layer) {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.pdf-annotations :deep(section) {
  position: absolute;
  box-sizing: border-box;
  transform-origin: 0 0;
}
.pdf-annotations :deep(a) {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
.pdf-annotations :deep(a:focus-visible) {
  outline: 2px solid var(--color-accent-ink);
  outline-offset: 2px;
}
.pdf-viewport canvas {
  display: block;
  margin-inline: auto;
  background: white;
  box-shadow: 0 1px 6px rgb(24 24 24 / 12%);
  max-width: none;
}
.pdf-state {
  padding: 32px 16px;
}
.pdf-state p {
  margin-block: 16px;
}
.pdf-footer {
  padding: 12px 24px;
  border-top: 1px solid var(--color-line);
  background: var(--color-surface);
}
@media (max-width: 600px) {
  .resume-modal {
    width: calc(100% - 16px);
    height: calc(100dvh - 16px);
  }
  .resume-modal-header,
  .pdf-toolbar,
  .pdf-footer {
    padding: 12px;
  }
  .resume-modal-header .card-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .resume-modal-header .action {
    min-height: 44px;
  }
  .resume-modal h2 {
    font-size: 22px;
  }
  .pdf-toolbar {
    gap: 8px;
  }
}
</style>
