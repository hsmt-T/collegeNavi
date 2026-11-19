import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import {
  clientAuthErrorSchema,
  clientLoginRequestSchema,
  clientLoginResponseSchema,
  clientRegisterRequestSchema,
  clientRegisterResponseSchema,
  type ClientAuthError,
} from '@collegenavi/schemas'
import { HTTPException } from 'hono/http-exception'
import type { env } from '../../infra/cloudflare/env'

const errorResponse = (
  description: string,
  code: ClientAuthError['error']['code'],
  message: string,
) => ({
  description,
  content: {
    'application/json': {
      schema: clientAuthErrorSchema,
      example: { error: { code, message } },
    },
  },
})

const commonResponses = {
  400: errorResponse(
    '入力不正、必須項目不足、パスワード確認不一致、または不正なJSON',
    'INVALID_REQUEST',
    '入力内容を確認してください。',
  ),
  500: errorResponse(
    'サーバー内部エラー（本処理実装後）',
    'INTERNAL_SERVER_ERROR',
    '処理に失敗しました。',
  ),
  501: errorResponse(
    '仕様確認段階のため本処理は未実装。有効な入力でもこの応答になります。',
    'NOT_IMPLEMENTED',
    'このAPIは仕様確認段階です。登録・ログイン処理は未実装です。',
  ),
}

export const clientRegisterRoute = createRoute({
  method: 'post',
  path: '/clients/register',
  tags: ['クライアント認証'],
  operationId: 'registerClient',
  summary: '学校担当者（クライアント）を登録する',
  description:
    '仕様案。本処理は未実装で、有効な入力には501を返します。学校情報の入力に先立つ担当者登録です。登録時に学校名は入力しません。staff_nameはclients.nameに保存する担当者氏名です。学校名は後続の学校情報入力で受け取ります。担当者登録時は学校未所属を許容し、学校登録・所属追加時にclient_collegesへ関連を保存します。既存学校への関連付けの権限・手順は本処理実装前に確定します。パスワードはハッシュ化前の入力を8文字以上30文字以下で検証します。入力をトリム・切り詰めしません。',
  security: [],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: clientRegisterRequestSchema,
          example: {
            staff_name: '山田太郎',
            email: 'staff@example.com',
            password: 'ExamplePassword123!',
            password_confirmation: 'ExamplePassword123!',
          },
        },
      },
    },
  },
  responses: {
    201: {
      description:
        '登録成功（本処理実装後）。パスワード・ハッシュは返しません。',
      content: {
        'application/json': {
          schema: clientRegisterResponseSchema,
          example: {
            client: { id: 1, name: '山田太郎', email: 'staff@example.com' },
          },
        },
      },
    },
    409: errorResponse(
      'メールアドレスが登録済み（本処理実装後）',
      'EMAIL_ALREADY_EXISTS',
      'このメールアドレスは登録済みです。',
    ),
    ...commonResponses,
  },
})

export const clientLoginRoute = createRoute({
  method: 'post',
  path: '/clients/login',
  tags: ['クライアント認証'],
  operationId: 'loginClient',
  summary: '学校担当者（クライアント）がログインする',
  description:
    '仕様案。本処理は未実装で、有効な入力には501を返します。パスワードは8文字以上30文字以下で検証し、入力をトリム・切り詰めしません。セッション方式（Cookie・トークン）、有効期限、ログアウト、試行回数制限は本処理実装前に確定します。200の本文は公開可能なクライアント情報の案であり、認証情報の受け渡し方法は未確定です。認証失敗はメール未登録・パスワード不一致を区別せず401に統一します。',
  security: [],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: clientLoginRequestSchema,
          example: {
            email: 'staff@example.com',
            password: 'ExamplePassword123!',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'ログイン成功（本処理実装後）。セッション方式は未確定。',
      content: {
        'application/json': {
          schema: clientLoginResponseSchema,
          example: {
            client: { id: 1, name: '山田太郎', email: 'staff@example.com' },
          },
        },
      },
    },
    401: errorResponse(
      'メールアドレスまたはパスワードが不正（本処理実装後）',
      'INVALID_CREDENTIALS',
      'メールアドレスまたはパスワードが正しくありません。',
    ),
    ...commonResponses,
  },
})

export const clientAuthRoutes = new OpenAPIHono<env>({
  defaultHook: (result, c) => {
    if (!result.success) {
      // 入力値やZodの生エラーを返さず、認証情報の露出を防ぐ。
      return c.json(
        {
          error: {
            code: 'INVALID_REQUEST' as const,
            message: '入力内容を確認してください。',
          },
        },
        400,
      )
    }
  },
})

clientAuthRoutes.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store')
  await next()
})

clientAuthRoutes.onError((error, c) => {
  if (error instanceof HTTPException && error.status === 400) {
    return c.json(
      {
        error: {
          code: 'INVALID_REQUEST' as const,
          message: '入力内容を確認してください。',
        },
      },
      400,
    )
  }
  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR' as const,
        message: '処理に失敗しました。',
      },
    },
    500,
  )
})

clientAuthRoutes.openapi(clientRegisterRoute, (c) =>
  c.json(commonResponses[501].content['application/json'].example, 501),
)
clientAuthRoutes.openapi(clientLoginRoute, (c) =>
  c.json(commonResponses[501].content['application/json'].example, 501),
)
