import type { SanitizationConfig } from './SanitizationConfig'

export function createSanitizationConfig(): SanitizationConfig {
  return {
    blacklistedTerms: ['CompetitorX', 'ProjectApollo', 'lazy-dev'],
    patterns: {
      apiKey: /sk-[a-zA-Z0-9-]+/gi,
      creditCard: /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g,
      phoneNumber: /\b\d{4}-\d{4}-\d{4}(?!-\d{4})\b/g,
    },
  }
}
