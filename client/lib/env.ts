import { z } from 'zod'

const envSchema = z.object({
  LOCAL_LLM_URL: z.string().url().default('http://localhost:11434'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)