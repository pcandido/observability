const http = require('http')
const express = require('express')

const app = express()

app.get('/health-check', (req, res) => {
  res.status(200).end()
})

app.get('/', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(`request from ${clientIp}`)
  res.send('Hello world!!!')
})

const port = parseInt(process.env.PORT ?? 8080)
http.createServer(app).listen(port, '0.0.0.0', () => {
  console.log(`listening on http://localhost:${port}`)
})
