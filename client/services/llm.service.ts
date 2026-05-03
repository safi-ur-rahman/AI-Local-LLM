import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { Message } from '@/utils/types'

export const streamLocalResponse = async (messages: Message[]) => {
  const body = JSON.stringify({
    model: 'phi3',
    messages,
    stream: true,
  })

  logger.info({ file: 'llm.service.ts' }, 'Initiating streamLocalResponse')
  logger.info(
    { file: 'llm.service.ts' },
    `Environment Local LLM URL: ${env.LOCAL_LLM_URL}`,
  )
  logger.info({ file: 'llm.service.ts' }, `LLM Post body: ${body}`)

  // 1. Prepare the request to local model
  try {
    const response = await fetch(`${env.LOCAL_LLM_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    logger.info({ file: 'llm.service.ts' }, `LLM Response: ${response}`)

    // 2. Error handling: Check if Ollama is actually running
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error({ file: 'llm.service.ts' }, `[OLLAMA ERROR]: ${errorData}`)
      throw new Error(errorData.error?.message || 'Failed to connect to Ollama')
    }

    // 3. Return the raw stream (ReadableStream) to the Hono route
    logger.info(
      { file: 'llm.service.ts' },
      `LLM Response Body: ${response.body}`,
    )
    return response.body
  } catch (error) {
    // Check if error is actually an Error object
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'

    logger.error(
      {
        file: 'llm.service.ts',
        stack: error instanceof Error ? error.stack : undefined,
      },
      `Error in fetch POST for LLM call: ${errorMessage}`,
    )
  }
}
