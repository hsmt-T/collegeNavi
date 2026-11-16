import { z } from 'zod'

export const databaseHealthSchema = z
  .object({
    connected: z.number().int(),
  })
  .nullable()

export type DatabaseHealth = z.infer<typeof databaseHealthSchema>
