const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io')
const { v4:uuidv4 } = require('uuid')
const fs = require('node:fs');

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
const unsentMessages = []

io.use((socket, next) => {
  const user = socket.handshake.auth
  const auth = user.auth
  
  if(auth === 'register') {
    const username = user.username
    const password = user.password
    const userID = uuidv4()
    const userToAdd = {
      "username": username,
      "password": password,
      "userID": userID
    }
    socket.emit('session', {username: username, authType: auth})
    addUser(userToAdd)
    socket.id = userID
  } else if(auth === 'auto-login'){
    const userID = socket.handshake.auth.userID
    const user = allUsers.find(person => person.userID == userID)
    if(user){
      socket.id = userID
      socket.emit('session', {username: user.username, authType: auth})
    } else {
      return next(new Error('ID not found'))
    }
  } else if(auth === 'login') {
    const userDetails = socket.handshake.auth
    const user = allUsers.find((person) => {
      return person.username === userDetails.username && person.password === userDetails.password
    })
    if(user) {
      socket.id = user.userID
      socket.emit('session', {username: user.username, authType: auth})
    } else {
      return next(new Error('Username or password incorrect'))
    }
  }
  return next()
})


io.on('connection', (socket) => {
  console.log('A user is connected with socketID ' + socket.id)

  const currentUserUnreadMessages = unsentMessages.find(uid => socket.id in uid)
  if(currentUserUnreadMessages) {
    const userUnreadArray = currentUserUnreadMessages[socket.id]
    const index = unsentMessages.findIndex(users => currentUserUnreadMessages === users)
    unsentMessages.splice(index, 1)
    setTimeout(() => {
      socket.emit('unread_messages', userUnreadArray)
    }, 1000)
  }

  socket.on('send-message', (message) => {
    const userToSend = message.to
    const isClientConnected = io.sockets.sockets.has(message.to)
    console.log(`User is ${isClientConnected}`);
    if(!isClientConnected) {
      const targetUser = unsentMessages.find(uid => userToSend in uid)
      if(targetUser) {
        const targetArray = targetUser[userToSend]
        targetArray.push(message)
      } else {
        unsentMessages.push({ [userToSend]: [message] })
      }
    } else {
      socket.to(message.to).emit('receive-message', message)
    }
  })

  socket.on('typing-info', message => {
    socket.broadcast.emit('typing', message)
  })

  socket.on('search_user', keyword => {
    const usersFound = allUsers.filter(user => user.username.includes(keyword) && user.userID !== socket.id)
    usersFound.forEach(user => {
      delete user['password']
    })
    socket.emit('search_produced', usersFound)
  })

  socket.on('join_room', roomID => {
    socket.join(roomID)
    console.log(roomID);
  })

  socket.on('disconnecting', (reason) => {
    // console.log(reason)
    // console.log(socket.rooms, 'from disconncting')
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