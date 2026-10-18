import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { sections, type SectionId } from '../content/portfolio'

export function useActiveSection() {
  const active = ref<SectionId>('hero')
  let frame = 0
  function update() {
    frame = 0
    // Anchor positions can land on fractional CSS pixels after browser rounding.
    const offset = window.innerWidth < 768 ? 132 : 102
    let current: SectionId = 'hero'
    for (const id of sections) {
      if (
        (document.getElementById(id)?.getBoundingClientRect().top ??
          Infinity) <= offset
      )
        current = id
    }
    if (
      window.scrollY > 0 &&
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
    )
      current = 'contacts'
    active.value = current
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update)
  }
  onMounted(() => {
    void nextTick(update)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    cancelAnimationFrame(frame)
  })
  return active
}
