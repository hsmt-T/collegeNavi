import { z } from 'zod'

/** colleges の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const collegeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  location: z.string(),
  field: z.string(),
  site: z.string(),
  description: z.string(),
  features: z.string(),
  prefecture_code: z.string(),
  publication_status: z.string(),
  search_revision: z.number().int(),
})

export type College = z.infer<typeof collegeSchema>
