import { SanitizedChunk } from '../entities/SanitizedChunk'
import { ThreatDetection } from '../entities/ThreatDetection'
import type { ThreatType } from '../value-objects/ThreatType'
import type { SanitizationConfig } from '../../shared/config/SanitizationConfig'

export interface ITextSanitizer {
  sanitize(text: string): SanitizedChunk
}

export class TextSanitizer implements ITextSanitizer {
  private readonly config: SanitizationConfig

  constructor(config: SanitizationConfig) {
    this.config = config
  }

  sanitize(text: string): SanitizedChunk {
    let sanitized = text
    const threats: Map<ThreatType, number> = new Map()

    for (const term of this.config.blacklistedTerms) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      const matches = sanitized.match(regex)
      if (matches) {
        threats.set('Banned Word', (threats.get('Banned Word') || 0) + matches.length)
        sanitized = sanitized.replace(regex, '[REDACTED]')
      }
    }

    const apiKeyMatches = sanitized.match(this.config.patterns.apiKey)
    if (apiKeyMatches) {
      const validApiKeys = apiKeyMatches.filter(key => {
        const keyPart = key.substring(3)
        return keyPart.length >= 8 && /^[a-zA-Z0-9-]+$/.test(keyPart)
      })
      if (validApiKeys.length > 0) {
        threats.set('API Key', (threats.get('API Key') || 0) + validApiKeys.length)
        sanitized = sanitized.replace(this.config.patterns.apiKey, (match) => {
          const keyPart = match.substring(3)
          return keyPart.length >= 8 && /^[a-zA-Z0-9-]+$/.test(keyPart) ? '[REDACTED]' : match
        })
      }
    }

    const creditCardMatches = sanitized.match(this.config.patterns.creditCard)
    if (creditCardMatches) {
      threats.set('Credit Card', (threats.get('Credit Card') || 0) + creditCardMatches.length)
      sanitized = sanitized.replace(this.config.patterns.creditCard, '[REDACTED]')
    }

    const phoneMatches = sanitized.match(this.config.patterns.phoneNumber)
    if (phoneMatches) {
      threats.set('Phone Number', (threats.get('Phone Number') || 0) + phoneMatches.length)
      sanitized = sanitized.replace(this.config.patterns.phoneNumber, '[REDACTED]')
    }

    const threatArray = Array.from(threats.entries()).map(
      ([type, count]) => new ThreatDetection(type, count)
    )

    return new SanitizedChunk(sanitized, threatArray)
  }
}
