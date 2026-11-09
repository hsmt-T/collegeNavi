import { Hono } from 'hono'
import type { env } from './infra/cloudflare/env'

const app = new Hono<env>()

app.get('/health/db', async (c) => {
  const result = await c.env.D1.prepare('SELECT 1 AS connected').first<{ connected: number }>()
  return c.json(result)
})

export default app
