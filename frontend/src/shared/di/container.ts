import { TextSanitizer } from '../../domain/services/TextSanitizer'
import { SanitizationBuffer } from '../../infrastructure/services/SanitizationBuffer'
import { StreamService } from '../../infrastructure/services/StreamService'
import { StartStreamUseCase } from '../../application/use-cases/StartStreamUseCase'
import { createSanitizationConfig } from '../config/sanitizationConfigFactory'
import { STREAM_URL } from '../constants/api'

class Container {
  private _sanitizationConfig = createSanitizationConfig()
  private _textSanitizer = new TextSanitizer(this._sanitizationConfig)
  private _sanitizationBuffer = new SanitizationBuffer(this._textSanitizer)
  private _streamService = new StreamService()
  private _startStreamUseCase = new StartStreamUseCase(
    this._streamService,
    this._sanitizationBuffer,
    STREAM_URL
  )

  get startStreamUseCase(): StartStreamUseCase {
    return this._startStreamUseCase
  }

  resetBuffer(): void {
    this._sanitizationBuffer.reset()
  }
}

export const container = new Container()
