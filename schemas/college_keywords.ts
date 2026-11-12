import { z } from 'zod'

/** college_keywords の保存済みレコード。制約の未確定事項は README.md を参照。 */
export const collegeKeywordSchema = z.object({
  id: z.number().int(),
  college_id: z.number().int(),
  keyword: z.string(),
})

export type CollegeKeyword = z.infer<typeof collegeKeywordSchema>
