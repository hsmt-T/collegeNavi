import { z } from 'zod'

/** imgs の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const imgSchema = z.object({
  id: z.number().int(),
  key: z.string(),
  alt: z.string(),
  college_id: z.number().int(),
  event_id: z.number().int().nullable(),
  sort_order: z.number().int(),
})

export type Img = z.infer<typeof imgSchema>
