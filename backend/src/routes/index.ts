import { Hono } from 'hono'
import { streamHandler } from './stream'

const routes = new Hono()

routes.get('/', (c) => {
  return c.text('GhostProtocol Terminal Backend - Operational')
})

routes.get('/stream', streamHandler)

export default routes
