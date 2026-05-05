import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ConversationSchema } from '@/utils/schemas'
import { streamLocalResponse } from '@/services/llm.service'
import { logger } from '@/lib/logger'

const chatRouter = new Hono()

// Use Zod to validate the incoming request body
chatRouter.post('/', zValidator('json', ConversationSchema), async (c) => {
  const { messages } = c.req.valid('json')

  try {
    // Logic is still tucked away in your service layer
    const stream = await streamLocalResponse(messages)

    logger.info({ file: 'chat.ts' }, `LLM Stream: ${stream}`)

    // Hono makes streaming incredibly simple
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    logger.error(
      { file: 'chat.ts' },
      '[CHAT ROUTE] Error occurred while streaming response',
    )
    return c.json({ error: '[CHAT ROUTE] Something went wrong' }, 503)
  }
})

export { chatRouter }
