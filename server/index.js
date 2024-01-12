// const io = require('socket.io')(3000, {
//   cors: {
//     origin: ['http://localhost:4200']
//   }
// })

// console.log('Connected');
// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   // create new session
//   socket.sessionID = randomId();
//   socket.userID = randomId();
//   socket.username = username;
//   next();
// });
// io.on('connection', socket => {
//   console.log(socket.id)
//   console.log(socket.handshake.auth);

//   socket.on('send-message', (message, room) => {
//     if(room === '') {
//       socket.broadcast.emit('recieve-message', message)
//     } else {
//       socket.to(room).emit('recieve-message', message)
//     }
//   })

//   socket.on('join-room', roomId => {
//     socket.join(roomId)
//   })
// })



const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io')

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

io.on('connection', (socket) => {
  console.log('A user is connected');

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
    console.log("User Disconnected");
  })
})

server.listen(3000, () => {
  console.log('Server running on port 3000');
})