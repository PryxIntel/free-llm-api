import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseDuckDuckGoHtml, executeWebSearch } from '../../services/web-search.js'

describe('Web Search Service', () => {
  it('parses DuckDuckGo HTML snippet results properly', () => {
    const mockHtml = `
      <div class="result results_links results_links_deep web-result">
        <h2 class="result__title">
          <a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fnews&rut=1">
            Example Tech News
          </a>
        </h2>
        <a class="result__snippet" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fnews&rut=1">
          This is the latest test snippet about AI models.
        </a>
      </div>
    `

    const results = parseDuckDuckGoHtml(mockHtml, 5)
    expect(results.length).toBe(1)
    expect(results[0].title).toBe('Example Tech News')
    expect(results[0].url).toBe('https://example.com/news')
    expect(results[0].snippet).toBe('This is the latest test snippet about AI models.')
  })

  it('handles empty or whitespace queries gracefully', async () => {
    const res = await executeWebSearch('   ')
    expect(res.results).toEqual([])
    expect(res.provider).toBe('none')
  })
})
