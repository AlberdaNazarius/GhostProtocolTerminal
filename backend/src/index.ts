import { Hono } from 'hono'
import { cors } from 'hono/cors'
import routes from './routes'
import { SERVER_CONFIG } from './config/constants'

const app = new Hono()

app.use('/*', cors())
app.route('/', routes)

const port = SERVER_CONFIG.port
Bun.serve({
  port,
  fetch: app.fetch,
})