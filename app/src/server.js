const http = require('http')
const express = require('express')
const cors = require('cors')
const logger = require('./logger')

const app = express()
app.use(cors())

app.get('/health-check', (req, res) => {
  res.status(200).send('App is up!')
})

app.get('/fibonacci/:value', (req, res) => {
  const client = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const value = req.params['value']

  const shouldSimulateError = Math.random() < 0.05
  if (shouldSimulateError) {
    res.status(500).end()
    logger.error(`an error ocurred`, { client, value, headers: req.headers })
  } else {
    const start = new Date().getTime()
    const seq = fibonacciSec(value)
    const end = new Date().getTime()
    const spendTime = end - start

    res.json(seq)
    logger.info(`processed fibonacci of ${value} in ${spendTime}ms`, { client, value, spendTime, headers: req.headers })
  }
})

// purposefully inefficient
function fibonacciSec(num) {
  const data = []
  for (let i = 0; i < num; i++) {
    data.push(fibonacci(i))
  }
  return data
}

function fibonacci(num) {
  if (num < 2) {
    return num
  }
  else {
    return fibonacci(num - 1) + fibonacci(num - 2)
  }
}

const port = parseInt(process.env.PORT ?? 8080)
http.createServer(app).listen(port, '0.0.0.0', () => {
  console.log(`listening on http://localhost:${port}`)
})
