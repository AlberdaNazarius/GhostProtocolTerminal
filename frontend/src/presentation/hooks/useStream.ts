import { useState, useRef, useCallback } from 'react'
import { StartStreamUseCase } from '../../application/use-cases/StartStreamUseCase'
import type { SanitizedChunk } from '../../domain/entities/SanitizedChunk'
import type { ThreatDetection } from '../../domain/entities/ThreatDetection'

export interface UseStreamResult {
  displayText: string
  threats: Map<string, number>
  isStreaming: boolean
  startStream: () => Promise<void>
  stopStream: () => void
  reset: () => void
}

export function useStream(startStreamUseCase: StartStreamUseCase): UseStreamResult {
  const [displayText, setDisplayText] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [threats, setThreats] = useState<Map<string, number>>(new Map())
  const abortControllerRef = useRef<AbortController | null>(null)

  const updateThreats = useCallback((newThreats: ThreatDetection[]) => {
    setThreats(prev => {
      const updated = new Map(prev)
      newThreats.forEach(threat => {
        const key = threat.type
        updated.set(key, (updated.get(key) || 0) + threat.count)
      })
      return updated
    })
  }, [])

  const startStream = useCallback(async () => {
    if (isStreaming) return

    setIsStreaming(true)
    setDisplayText('')
    setThreats(new Map())

    abortControllerRef.current = new AbortController()

    await startStreamUseCase.execute(
      abortControllerRef.current.signal,
      (chunk: SanitizedChunk) => {
        setDisplayText(prev => prev + chunk.text)
        updateThreats(chunk.threats)
      },
      (error: Error) => {
        console.error('Stream error:', error)
        setDisplayText(prev => prev + '\n\n[ERROR] Stream connection failed.')
      },
      () => {
        setIsStreaming(false)
      }
    )

    setIsStreaming(false)
  }, [isStreaming, startStreamUseCase, updateThreats])

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    setDisplayText('')
    setThreats(new Map())
    setIsStreaming(false)
  }, [])

  return {
    displayText,
    threats,
    isStreaming,
    startStream,
    stopStream,
    reset,
  }
}
