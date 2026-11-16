import { z } from 'zod'
import { clientSchema } from './clients'
import { collegeSchema } from './colleges'

export const schoolStaffFormSchema = z
  .object({
    school_name: z.string().trim().min(1, '学校名を入力してください。'),
    staff_name: z.string().trim().min(1, '担当者氏名を入力してください。'),
    email: clientSchema.shape.email,
    password: z.string().min(1, 'パスワードを入力してください。'),
    password_confirmation: z.string(),
  })
  .refine((value) => value.password === value.password_confirmation, {
    path: ['password_confirmation'],
    message: 'パスワードが一致しません。',
  })

export const schoolFormSchema = collegeSchema
  .pick({
    name: true,
    location: true,
    field: true,
    site: true,
    description: true,
    features: true,
    prefecture_code: true,
  })
  .extend({
    name: z.string().trim().min(1, '学校名・キャンパス名を入力してください。'),
    location: z.string().trim().min(1, '所在地を入力してください。'),
    field: z.string().trim().min(1, '分野を入力してください。'),
    prefecture_code: z
      .string()
      .regex(/^(0[1-9]|[1-3][0-9]|4[0-7])$/, '都道府県を選択してください。'),
    site: z.union([z.literal(''), z.url({ protocol: /^https?$/ })]),
    event_title: z.string().trim().default(''),
    event_date: z.union([z.literal(''), z.iso.date()]).default(''),
    keywords: z
      .array(z.string().trim().min(1, '空白だけのキーワードは登録できません。'))
      .max(3, 'キーワードは3件までです。')
      .refine(
        (values) => new Set(values).size === values.length,
        '同じキーワードは登録できません。',
      ),
  })
  .refine((value) => Boolean(value.event_title) === Boolean(value.event_date), {
    path: ['event_date'],
    message: 'イベント名と開催日を両方入力してください。',
  })
export type SchoolForm = z.infer<typeof schoolFormSchema>
