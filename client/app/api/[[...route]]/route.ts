import 'server-only'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { chatRouter } from './chat'
import { logger } from 'hono/logger'
import { metricsMiddleware } from '@/middleware/metrics'

// This base path matches your folder structure
const app = new Hono().basePath('/api')
app.use(logger())
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('[Global Route] Something went wrong', 500)
})

app.use('*', metricsMiddleware);

// Route groups make your code very readable for public visitors
app.route('/chat', chatRouter)

export const GET = handle(app)
export const POST = handle(app)