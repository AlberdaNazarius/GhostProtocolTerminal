import type { SanitizedChunk } from '../../domain/entities/SanitizedChunk'

export type StreamChunkHandler = (chunk: SanitizedChunk) => void
