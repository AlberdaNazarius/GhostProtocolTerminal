export interface IStreamService {
  stream(url: string, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>
}

export class StreamService implements IStreamService {
  async stream(url: string, signal: AbortSignal): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(url, { signal })

    if (!response.body) {
      throw new Error('No response body')
    }

    return response.body
  }
}
