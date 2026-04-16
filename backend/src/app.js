import express from 'express'
import apiRouter from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(express.json())

  app.use((req, res, next) => {
    const startedAt = Date.now()
    console.log(`[API] ${req.method} ${req.originalUrl}`)

    res.on('finish', () => {
      const duration = Date.now() - startedAt
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`)
    })

    next()
  })

  app.get('/health', (req, res) => {
    res.json({ ok: true })
  })

  app.use('/', apiRouter)

  return app
}
