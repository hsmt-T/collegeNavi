import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { env } from './infra/cloudflare/env'

const app = new OpenAPIHono<env>()

app.get('/health/db', async (c) => {
  const result = await c.env.D1.prepare('SELECT 1 AS connected').first<{
    connected: number
  }>()
  return c.json(result)
})

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'カレッジナビ API',
    version: '0.1.0',
    description: 'カレッジナビのバックエンドAPI仕様',
  },
})

app.get('/docs', swaggerUI({ url: '/openapi.json' }))

export default app
