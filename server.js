// Add this code to your server-side JavaScript file (e.g., server.js)

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// Start the server
const PORT = process.env.PORT || 3000
http.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`)
})

// Define an array to store message history
let messageHistory = []

// Handle incoming connections
io.on('connection', function (socket) {
  console.log('A user connected.')

  // Emit message history to the new user
  socket.emit('messageHistory', messageHistory)

  // Handle login event
  socket.on('login', function (credentials) {
    // Perform login authentication (you can implement this logic)
    const { username, password } = credentials
    const success = true // Dummy success for demo
    socket.emit('loginResponse', { success })
  })

  // Handle incoming messages
  socket.on('sendMessage', function (message) {
    // Broadcast the message to all connected clients
    const username = socket.username
    const timestamp = Date.now()
    const formattedMessage = { username, message, timestamp }
    messageHistory.push(formattedMessage)
    io.emit('receiveMessage', formattedMessage)
  })

  // Handle disconnection
  socket.on('disconnect', function () {
    console.log('A user disconnected.')
  })
})


// Update the connection event handler in your server-side JavaScript file

// Array to store online users
let onlineUsers = []

// Update the connection event handler in your server-side JavaScript file

io.on('connection', function (socket) {
  console.log('A user connected.')

  // Handle login event
  socket.on('login', function (credentials) {
    // Perform login authentication (you can implement this logic)
    const { username, password } = credentials
    const success = true // Dummy success for demo

    if (success) {
      // Add user to online users list
      onlineUsers.push(username)
      // Emit updated user list to all clients
      io.emit('updateUserList', onlineUsers)
      // Store username in socket object
      socket.username = username
    }

    socket.emit('loginResponse', { success })
  })

  // Handle logout event
  socket.on('logout', function () {
    // Remove user from online users list
    const index = onlineUsers.indexOf(socket.username)
    if (index !== -1) {
      onlineUsers.splice(index, 1)
      // Emit updated user list to all clients
      io.emit('updateUserList', onlineUsers)
    }
    // Emit logout response
    socket.emit('logoutResponse')
  })

  // Handle disconnection
  socket.on('disconnect', function () {
    console.log('A user disconnected.')
    // Remove user from online users list
    const index = onlineUsers.indexOf(socket.username)
    if (index !== -1) {
      onlineUsers.splice(index, 1)
      // Emit updated user list to all clients
      io.emit('updateUserList', onlineUsers)
    }
  })
})
