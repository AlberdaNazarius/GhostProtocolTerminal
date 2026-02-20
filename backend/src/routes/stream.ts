import { Context } from 'hono'
import { MOCK_RESPONSE } from '../config/constants'
import { getRandomChunkSize, getRandomDelay, delay } from '../utils/stream'

function createStreamingResponse(): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      let index = 0
      const data = MOCK_RESPONSE

      try {
        while (index < data.length) {
          const chunkSize = Math.min(getRandomChunkSize(), data.length - index)
          const chunk = data.slice(index, index + chunkSize)
          
          controller.enqueue(new TextEncoder().encode(chunk))
          index += chunkSize

          if (index < data.length) {
            await delay(getRandomDelay())
          }
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })
}

export async function streamHandler(c: Context) {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Transfer-Encoding', 'chunked')
  c.header('Cache-Control', 'no-cache')
  c.header('Connection', 'keep-alive')
  c.header('X-Accel-Buffering', 'no')

  const stream = createStreamingResponse()
  return c.body(stream)
}
