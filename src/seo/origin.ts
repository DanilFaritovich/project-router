export function parseSiteOrigin(value?: string): string | undefined {
  if (!value?.trim()) return undefined
  const url = new URL(value.trim())
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    // search/hash omit empty delimiters, which still are not part of an origin.
    url.href.includes('?') ||
    url.href.includes('#')
  ) {
    throw new Error(
      'VITE_SITE_ORIGIN must be a public HTTPS origin without credentials, path, query or hash',
    )
  }
  return url.origin
}
