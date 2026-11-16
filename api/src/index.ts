import { databaseHealthSchema, type DatabaseHealth } from '@collegenavi/schemas'
import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { env } from './infra/cloudflare/env'

const app = new OpenAPIHono<env>()

const databaseHealthRoute = createRoute({
  method: 'get',
  path: '/health/db',
  operationId: 'getDatabaseHealth',
  tags: ['Health'],
  summary: 'D1データベースの接続確認',
  responses: {
    200: {
      description: '接続確認結果。行が取得できない場合はnull。',
      content: {
        'application/json': {
          schema: databaseHealthSchema,
          example: { connected: 1 },
        },
      },
    },
    500: {
      description: 'データベースへの接続またはクエリに失敗しました。',
    },
  },
})

app.openapi(databaseHealthRoute, async (c) => {
  const result = await c.env.D1.prepare('SELECT 1 AS connected').first<
    NonNullable<DatabaseHealth>
  >()
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
