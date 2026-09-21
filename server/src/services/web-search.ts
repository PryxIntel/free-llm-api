export interface SearchResultItem {
  title: string
  url: string
  snippet: string
}

export interface SearchResponse {
  query: string
  results: SearchResultItem[]
  provider: string
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
}

export function parseDuckDuckGoHtml(html: string, maxResults = 5): SearchResultItem[] {
  const results: SearchResultItem[] = []
  const blocks = html.split(/class="[^"]*result\s+results_links/i)

  for (let i = 1; i < blocks.length && results.length < maxResults; i++) {
    const block = blocks[i]
    const titleMatch = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(block)
    if (!titleMatch) continue

    let url = titleMatch[1]
    if (url.includes('uddg=')) {
      try {
        const u = new URL(url, 'https://html.duckduckgo.com')
        const target = u.searchParams.get('uddg')
        if (target) url = decodeURIComponent(target)
      } catch {
        // keep fallback url
      }
    }

    const title = decodeHtmlEntities(titleMatch[2].replace(/<[^>]+>/g, '').trim())
    const snippetMatch =
      /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(block) ||
      /<div[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(block)

    const snippet = snippetMatch
      ? decodeHtmlEntities(snippetMatch[1].replace(/<[^>]+>/g, '').trim())
      : ''

    if (title && url) {
      results.push({ title, url, snippet })
    }
  }

  return results
}

async function searchDuckDuckGo(query: string, maxResults: number, signal?: AbortSignal): Promise<SearchResultItem[]> {
  const endpoint = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const res = await fetch(endpoint, {
    signal,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!res.ok) {
    throw new Error(`DuckDuckGo responded with HTTP ${res.status}`)
  }

  const html = await res.text()
  return parseDuckDuckGoHtml(html, maxResults)
}

async function searchWikipediaFallback(query: string, maxResults: number, signal?: AbortSignal): Promise<SearchResultItem[]> {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
    query,
  )}&limit=${maxResults}&namespace=0&format=json`

  const res = await fetch(endpoint, { signal })
  if (!res.ok) return []
  const data = (await res.json()) as [string, string[], string[], string[]]
  if (!Array.isArray(data) || data.length < 4) return []

  const titles = data[1] || []
  const snippets = data[2] || []
  const urls = data[3] || []

  const results: SearchResultItem[] = []
  for (let i = 0; i < titles.length && results.length < maxResults; i++) {
    if (titles[i] && urls[i]) {
      results.push({
        title: titles[i],
        snippet: snippets[i] || '',
        url: urls[i],
      })
    }
  }
  return results
}

export async function executeWebSearch(
  query: string,
  maxResults = 5,
  timeoutMs = 8000,
): Promise<SearchResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { query: '', results: [], provider: 'none' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const results = await searchDuckDuckGo(trimmed, maxResults, controller.signal)
    if (results.length > 0) {
      return { query: trimmed, results, provider: 'duckduckgo' }
    }
  } catch {
    // Attempt fallback
  } finally {
    clearTimeout(timer)
  }

  // Fallback to Wikipedia
  try {
    const fallbackController = new AbortController()
    const fbTimer = setTimeout(() => fallbackController.abort(), 4000)
    try {
      const fbResults = await searchWikipediaFallback(trimmed, maxResults, fallbackController.signal)
      return { query: trimmed, results: fbResults, provider: 'wikipedia-fallback' }
    } finally {
      clearTimeout(fbTimer)
    }
  } catch {
    return { query: trimmed, results: [], provider: 'error' }
  }
}
