import { Router } from 'express'
import type { Request, Response } from 'express'
import { executeWebSearch } from '../services/web-search.js'

export const searchRouter = Router()

searchRouter.get('/', async (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q : ''
  const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10)

  if (!query.trim()) {
    res.json({ query: '', results: [], provider: 'none' })
    return
  }

  try {
    const searchData = await executeWebSearch(query, limit)
    res.json(searchData)
  } catch (err: any) {
    res.status(500).json({
      error: 'Search failed',
      message: err?.message ?? 'Unknown error executing web search',
      results: [],
    })
  }
})

searchRouter.post('/', async (req: Request, res: Response) => {
  const query = typeof req.body?.q === 'string' ? req.body.q : (typeof req.body?.query === 'string' ? req.body.query : '')
  const limit = Math.min(Math.max(Number(req.body?.limit) || 5, 1), 10)

  if (!query.trim()) {
    res.json({ query: '', results: [], provider: 'none' })
    return
  }

  try {
    const searchData = await executeWebSearch(query, limit)
    res.json(searchData)
  } catch (err: any) {
    res.status(500).json({
      error: 'Search failed',
      message: err?.message ?? 'Unknown error executing web search',
      results: [],
    })
  }
})
