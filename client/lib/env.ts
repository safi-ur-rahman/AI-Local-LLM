import { NodeEnvironment } from '@/utils/enums'
import 'server-only'
import { z } from 'zod'

const envSchema = z.object({
  LOCAL_LLM_URL: z.url().default('http://localhost:11434'),
  NODE_ENV: z
    .enum(Object.values(NodeEnvironment) as [string, ...string[]])
    .default(NodeEnvironment.Development),
})

export const env = envSchema.parse(process.env)
