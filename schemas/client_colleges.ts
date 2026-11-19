import { z } from 'zod'

/** 担当者とキャンパスの所属。複合PK・FKはDBで保証する。 */
export const clientCollegeSchema = z.object({
  client_id: z.number().int(),
  college_id: z.number().int(),
})

export type ClientCollege = z.infer<typeof clientCollegeSchema>
