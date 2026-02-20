import { ThreatDetection } from './ThreatDetection'

export class SanitizedChunk {
  public readonly text: string
  public readonly threats: ThreatDetection[]

  constructor(text: string, threats: ThreatDetection[]) {
    this.text = text
    this.threats = threats
  }

  toJSON() {
    return {
      text: this.text,
      threats: this.threats.map(t => t.toJSON()),
    }
  }
}
