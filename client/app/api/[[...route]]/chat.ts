import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ConversationSchema } from '@/utils/schemas'
import { streamLocalResponse } from '@/services/llm.service'

const chatRouter = new Hono()

// Use Zod to validate the incoming request body
chatRouter.post(
  '/',
  zValidator(
    'json',
    ConversationSchema
  ),
  async (c) => {
    const { messages } = c.req.valid('json')
    
    try {
      // Logic is still tucked away in your service layer
      const stream = await streamLocalResponse(messages)
      
      // Hono makes streaming incredibly simple
      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' },
      })
    } catch (err) {
      return c.json({ error: '[CHAT ROUTE] Something went wrong' }, 503)
    }
  }
)

export { chatRouter }