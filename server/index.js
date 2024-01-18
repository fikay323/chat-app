
const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io')
const { v4:uuidv4 } = require('uuid')
const fs = require('node:fs')

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


let allUsers = []

io.use((socket, next) => {
  const user = socket.handshake.auth
  const username = user.username
  const password = user.password
  const userID = uuidv4()
  const auth = user.auth

  if(auth === 'register') {
    const userToAdd = {
      "username": username,
      "password": password,
      "userID": userID
    }
    socket.user = userToAdd
    addUser(userToAdd)
  }
  socket.id = userID
  return next()
})
io.on('connection', (socket) => {
  console.log('A user is connected with socketID ' + socket.id)

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


async function readFile() {
  try{
    const data = fs.readFileSync('./users.json', 'utf8')
    return JSON.parse(data)
  } catch(error) {
    console.log(error);
  }
}

readFile().then(data => {
  allUsers = data
})

const addUser = async (user) => {
  try {
    allUsers.push(user);
    fs.writeFileSync('users.json', JSON.stringify(allUsers))
  } catch (error) {
    console.log(error);
  }
}

server.listen(3000, () => {
  console.log('Server running on port 3000');
})