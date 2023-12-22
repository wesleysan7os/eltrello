import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

import * as usersController from './controllers/users'
import bodyParser from 'body-parser'

const app = express()
const httpServer = createServer(app)
const io = new Server

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send("API is running!")
})

app.post('/api/users', usersController.register)

io.on('connection', () => {
  console.log('connected!')
})

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
  console.log('connected to mongodb')
  httpServer.listen(4001, () => {
    console.log('API is running on port 4001')
  })
})
