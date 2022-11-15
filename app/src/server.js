const http = require('http')
const express = require('express')
const logger = require('./logger')

const app = express()

app.get('/health-check', (req, res) => {
  res.status(200).send('App is up!')
})

app.get('/', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  const shouldSimulateError = Math.random() < 0.05
  if (shouldSimulateError) {
    res.status(500).end()
    logger.error(`request from ${clientIp}: fail`)
  } else {
    res.send('Hello world!!!')
    logger.info(`request from ${clientIp}: success`)
  }
})

const port = parseInt(process.env.PORT ?? 8080)
http.createServer(app).listen(port, '0.0.0.0', () => {
  console.log(`listening on http://localhost:${port}`)
})
