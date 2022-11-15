const express = require('express')

const port = parseInt(process.env.PORT ?? 8080)
const app = express()

app.get('/', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(`request from ${clientIp}`)
  res.send('Hello world!!!')
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})