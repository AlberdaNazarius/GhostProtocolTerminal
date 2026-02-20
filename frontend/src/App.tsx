import { Terminal } from './presentation/components/Terminal'
import { container } from './shared/di/container'
import './App.css'

function App() {
  return <Terminal startStreamUseCase={container.startStreamUseCase} />
}

export default App
