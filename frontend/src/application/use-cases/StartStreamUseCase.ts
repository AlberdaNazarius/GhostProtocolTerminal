import type { IStreamService } from '../../infrastructure/services/StreamService'
import type { ISanitizationBuffer } from '../../infrastructure/services/SanitizationBuffer'
import type { StreamChunkHandler } from '../dto/StreamChunkHandler'

export class StartStreamUseCase {
  private readonly streamService: IStreamService
  private readonly buffer: ISanitizationBuffer
  private readonly url: string

  constructor(streamService: IStreamService, buffer: ISanitizationBuffer, url: string) {
    this.streamService = streamService
    this.buffer = buffer
    this.url = url
  }

  async execute(
    signal: AbortSignal,
    onChunk: StreamChunkHandler,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      const stream = await this.streamService.stream(this.url, signal)
      const reader = stream.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          const final = this.buffer.flush()
          onChunk(final)
          onComplete()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const sanitized = this.buffer.processChunk(chunk)
        onChunk(sanitized)
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        onError(error)
      }
    }
  }
}
