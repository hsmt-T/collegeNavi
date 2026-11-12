import { z } from 'zod'

/** events の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const eventSchema = z.object({
  id: z.number().int(),
  college_id: z.number().int(),
  title: z.string(),
  description: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  publication_status: z.string(),
})

export type Event = z.infer<typeof eventSchema>
