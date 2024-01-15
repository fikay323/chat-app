
const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io')
const { v4:uuidv4 } = require('uuid')

  const app = express()
  const server = createServer(app)
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:4200'],
    },
  })

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
  })
io.use((socket, next) => {
  next()
})
io.on('connection', (socket) => {
  // let socketID = socket.handshake.query.sessionID

  // if(!sessionID) {
  //   sessionID = generateUID()
  // }
  console.log('A user is connected with socketID ' + socket.id)
  // socket.id = sessionID

  socket.on('send-message', (message) => {
    // if(room === '') {
      socket.broadcast.emit('recieve-message', message)
    // } else {
    //   socket.to(room).emit('recieve-message', message)
    // }
  })

  socket.on('typing-info', message => {
    socket.broadcast.emit('typing', message)
  })
  
  socket.on('disconnect', () => {
    console.log(`User with id ${socket.id} has disconnected`);
  })
})

function generateUID() {
  return uuidv4;
}

server.listen(3000, () => {
  console.log('Server running on port 3000');
})