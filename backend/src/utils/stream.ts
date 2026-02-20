import { SERVER_CONFIG } from '../config/constants'

export function getRandomDelay(): number {
  const { min, max } = SERVER_CONFIG.delay
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomChunkSize(): number {
  const { min, max } = SERVER_CONFIG.chunkSize
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
