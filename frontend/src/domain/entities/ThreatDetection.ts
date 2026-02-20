import type { ThreatType } from '../value-objects/ThreatType'

export class ThreatDetection {
  public readonly type: ThreatType
  public readonly count: number

  constructor(type: ThreatType, count: number) {
    if (count < 0) {
      throw new Error('Threat count cannot be negative')
    }
    this.type = type
    this.count = count
  }

  toJSON() {
    return {
      type: this.type,
      count: this.count,
    }
  }
}
