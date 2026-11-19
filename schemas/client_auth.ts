import { z } from 'zod'
import { clientSchema } from './clients'
import { schoolStaffFormSchema } from './school_forms'

/** 担当者フォームと共通の契約。パスワードはハッシュ化前に8〜30文字を検証。 */
export const clientRegisterRequestSchema = schoolStaffFormSchema

export const clientLoginRequestSchema = z.object({
  email: clientSchema.shape.email,
  password: schoolStaffFormSchema.shape.password,
})

/** 公開可能な項目だけを明示し、password_hash は含めない。 */
export const publicClientSchema = clientSchema.pick({
  id: true,
  name: true,
  email: true,
})

export const clientRegisterResponseSchema = z.object({
  client: publicClientSchema,
})

export const clientLoginResponseSchema = z.object({
  client: publicClientSchema,
})

export const clientAuthErrorSchema = z.object({
  error: z.object({
    code: z.enum([
      'INVALID_REQUEST',
      'EMAIL_ALREADY_EXISTS',
      'INVALID_CREDENTIALS',
      'NOT_IMPLEMENTED',
      'INTERNAL_SERVER_ERROR',
    ]),
    message: z.string(),
  }),
})

export type ClientRegisterRequest = z.infer<typeof clientRegisterRequestSchema>
export type ClientLoginRequest = z.infer<typeof clientLoginRequestSchema>
export type PublicClient = z.infer<typeof publicClientSchema>
export type ClientRegisterResponse = z.infer<
  typeof clientRegisterResponseSchema
>
export type ClientLoginResponse = z.infer<typeof clientLoginResponseSchema>
export type ClientAuthError = z.infer<typeof clientAuthErrorSchema>
