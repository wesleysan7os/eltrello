import express, { application } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import * as usersController from './controllers/users'
import * as boardsController from './controllers/boards'
import bodyParser from 'body-parser'
import authMiddleware from './middlewares/auth'
import cors from 'cors'
import { SocketEventsEnum } from './types/socketEvents.enum'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id
  }
})

app.get('/', (req, res) => {
  res.send("API is running!")
})

app.get('/api/users', usersController.retrieveAll)
app.post('/api/users', usersController.register)
app.post('/api/users/login', usersController.login)
app.get('/api/user', authMiddleware, usersController.currentUser)

app.get('/api/boards', authMiddleware, boardsController.getBoards)
app.post('/api/boards', authMiddleware, boardsController.createBoard)
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard)

io.on('connection', (socket) => {
  socket.on(SocketEventsEnum.boardsJoin, (data) => {
    boardsController.joinBoard(io, socket, data)
  })
  socket.on(SocketEventsEnum.boardsLeave, (data) => {
    boardsController.leaveBoard(io, socket, data)
  })
})

mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
  console.log('connected to mongodb')
  httpServer.listen(4001, () => {
    console.log('API is running on port 4001')
  })
})
