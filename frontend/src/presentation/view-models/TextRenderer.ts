import React from 'react'

export class TextRenderer {
  static renderWithRedactions(text: string): (string | React.ReactElement)[] | string {
    if (!text) return text

    const parts: (string | React.ReactElement)[] = []
    const regex = /(\[REDACTED\])/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    let keyCounter = 0

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(
        React.createElement(
          'span',
          { key: `redacted-${keyCounter++}-${match.index}`, className: 'redacted' },
          '[REDACTED]'
        )
      )
      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }
}
