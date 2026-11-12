import { z } from 'zod'

/** clients の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const clientSchema = z.object({
  id: z.number().int(),
  college_id: z.number().int(),
  email: z.email(),
  password_hash: z.string(),
})

export type Client = z.infer<typeof clientSchema>
