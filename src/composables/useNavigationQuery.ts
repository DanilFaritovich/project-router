import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export function useNavigationQuery() {
  const route = useRoute()
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  // SSG HTML has no request query. Match it during hydration, then update hrefs.
  return computed(() => (mounted.value ? route.query : {}))
}
