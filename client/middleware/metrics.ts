import { Context, Next } from 'hono'
import { getEncoding } from 'js-tiktoken'
import { logger } from '@/lib/logger'

export const enc = getEncoding('gpt2')

export const metricsMiddleware = async (c: Context, next: Next) => {
  const start = Date.now()
  const sessionId = c.req.header('x-session-id') || 'anonymous'

  // --- STAGE 1: Input Metrics ---
  const body = await c.req.json()
  const messages = body.messages || []
  const tokensIn = enc.encode(
    messages.map((m: any) => m.content).join(' '),
  ).length

  // Store data in context for the post-processing stage
  c.set('metrics', {
    tokensIn,
    historyCount: messages.length,
    sessionId,
  })

  // Continue to the Chat Router
  await next()

  // --- STAGE 2: Output Metrics (Streaming Interception) ---
  const metrics = c.get('metrics')
  const originalResponse = c.res

  // Only intercept successful streaming responses
  if (originalResponse.ok && originalResponse.body) {
    const td = new TextDecoder()
    let fullResponse = ''

    // Create a TransformStream to "spy" on the outgoing text
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        fullResponse += td.decode(chunk, { stream: true })
        controller.enqueue(chunk)
      },
      flush() {
        const tokensOut = enc.encode(fullResponse).length
        const duration = Date.now() - start

        logger.info({
          msg: 'AI_TRACE_COMPLETE',
          sessionId: metrics.sessionId,
          stats: {
            tokens_in: metrics.tokensIn,
            tokens_out: tokensOut,
            history_depth: metrics.historyCount,
            latency_ms: duration,
            cache_hit: c.get('cacheHit') || false,
          },
        })
      },
    })

    // Replace the response body with our intercepted stream
    c.res = new Response(
      originalResponse.body.pipeThrough(transformStream),
      originalResponse,
    )
  }
}
