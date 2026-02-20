import { SanitizedChunk } from '../../domain/entities/SanitizedChunk'
import type { ITextSanitizer } from '../../domain/services/TextSanitizer'

const MAX_PATTERN_LEN = 50
const PARTIAL_API_KEY = /^s(k(-[a-zA-Z0-9-]*)?)?$/i
const PARTIAL_NUMBER = /^\d{1,4}(-\d{1,4}){0,3}$|^\d{1,4}(-\d{1,4}){0,2}-$/
const blacklistedTerms = ['CompetitorX', 'ProjectApollo', 'lazy-dev']

export interface ISanitizationBuffer {
  processChunk(chunk: string): SanitizedChunk
  flush(): SanitizedChunk
  reset(): void
}

export class SanitizationBuffer implements ISanitizationBuffer {
  private pending: string = ''
  private readonly sanitizer: ITextSanitizer

  constructor(sanitizer: ITextSanitizer) {
    this.sanitizer = sanitizer
  }

  public processChunk(chunk: string): SanitizedChunk {
    this.pending += chunk

    let holdFrom = this.findTailHoldPoint()
    holdFrom = this.adjustForPartialSpans(holdFrom)

    if (holdFrom <= 0) {
      return new SanitizedChunk('', [])
    }

    const toEmit = this.pending.substring(0, holdFrom)
    this.pending = this.pending.substring(holdFrom)

    return this.sanitizer.sanitize(toEmit)
  }

  public flush(): SanitizedChunk {
    if (this.pending.length === 0) {
      return new SanitizedChunk('', [])
    }
    const result = this.sanitizer.sanitize(this.pending)
    this.pending = ''
    return result
  }

  public reset(): void {
    this.pending = ''
  }

  private findTailHoldPoint(): number {
    const p = this.pending
    const len = p.length
    if (len === 0) return 0

    const searchStart = Math.max(0, len - MAX_PATTERN_LEN)
    let holdFrom = len

    for (const term of blacklistedTerms) {
      for (let prefixLen = 1; prefixLen < term.length && prefixLen <= len; prefixLen++) {
        const startPos = len - prefixLen
        if (startPos < searchStart) break
        if (p.substring(startPos) === term.substring(0, prefixLen)) {
          holdFrom = Math.min(holdFrom, startPos)
        }
      }
    }

    for (let i = searchStart; i < len; i++) {
      const tail = p.substring(i)
      if (PARTIAL_API_KEY.test(tail)) {
        holdFrom = Math.min(holdFrom, i)
        break
      }
    }

    for (let i = searchStart; i < len; i++) {
      if (i > 0 && /\w/.test(p[i - 1])) continue
      if (!/\d/.test(p[i])) continue
      const tail = p.substring(i)
      if (PARTIAL_NUMBER.test(tail)) {
        holdFrom = Math.min(holdFrom, i)
        break
      }
    }

    return holdFrom
  }

  private adjustForPartialSpans(holdFrom: number): number {
    if (holdFrom <= 0 || holdFrom >= this.pending.length) return holdFrom

    const p = this.pending
    let adjusted = holdFrom

    for (const term of blacklistedTerms) {
      const earliest = Math.max(0, adjusted - term.length + 1)
      for (let start = earliest; start < adjusted; start++) {
        const availableLen = Math.min(term.length, p.length - start)
        const available = p.substring(start, start + availableLen)
        if (term.substring(0, availableLen) === available && start + term.length > adjusted) {
          adjusted = Math.min(adjusted, start)
        }
      }
    }

    for (let start = Math.max(0, adjusted - MAX_PATTERN_LEN); start < adjusted; start++) {
      if (p[start].toLowerCase() !== 's') continue
      const sub = p.substring(start)
      const m = sub.match(/^sk-[a-zA-Z0-9-]+/i)
      if (m && start + m[0].length > adjusted) {
        adjusted = Math.min(adjusted, start)
        break
      }
    }

    for (let start = Math.max(0, adjusted - 19); start < adjusted; start++) {
      if (start > 0 && /\w/.test(p[start - 1])) continue
      if (!/\d/.test(p[start])) continue
      const sub = p.substring(start)
      const m = sub.match(/^\d{1,4}(-\d{1,4}){1,3}/)
      if (m && start + m[0].length > adjusted) {
        adjusted = Math.min(adjusted, start)
        break
      }
    }

    return adjusted
  }
}
