export interface SanitizationPatterns {
  apiKey: RegExp
  creditCard: RegExp
  phoneNumber: RegExp
}

export interface SanitizationConfig {
  blacklistedTerms: string[]
  patterns: SanitizationPatterns
}
