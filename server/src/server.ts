import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

const app = express()
const httpServer = createServer(app)
const io = new Server

app.get("/", (req, res) => {
  res.send("API is running!")
})

io.on('connection', () => {
  console.log('connected!')
})

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
  console.log('connected to mongodb')
  httpServer.listen(4001, () => {
    console.log('API is running on port 4001')
  })
})
