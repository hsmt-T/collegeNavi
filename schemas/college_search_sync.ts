import { z } from 'zod'

/** college_search_sync の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const collegeSearchSyncSchema = z.object({
  college_id: z.number().int(),
  desired_revision: z.number().int(),
  indexed_revision: z.number().int().nullable(),
  index_version: z.string(),
  content_hash: z.string().nullable(),
  status: z.enum(['pending', 'submitted', 'ready', 'failed', 'deleting']),
  mutation_id: z.string().nullable(),
  attempt_count: z.number().int(),
  last_error: z.string().nullable(),
  updated_at: z.string(),
})

export type CollegeSearchSync = z.infer<typeof collegeSearchSyncSchema>
