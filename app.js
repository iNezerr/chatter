// Initialize Socket.IO
const socket = io('https://eben-chatter.netlify.app:3000')

// Handle login form submission
$('#loginForm').submit(function (event) {
  event.preventDefault()

  // Get username and password
  const username = $('#username').val()
  const password = $('#password').val()

  // Simple validation (you can enhance this as needed)
  if (username.trim() === '' || password.trim() === '') {
    alert('Please enter both username and password.')
    return
  }

  // Emit login event
  socket.emit('login', { username, password })
})

// Listen for login response
socket.on('loginResponse', function (response) {
  const { success } = response

  if (success) {
    // Hide the login form
    $('#loginForm').hide()

    // Show a message indicating that the user is logged in
    // $('#loggedInMessage').text(`Logged in as ${username}`).show();

    // Or alternatively, show the logout button
    $('#loggedInSection').show()

    // Update the logged-in username
    $('#loggedInUsername').text($('#username').val())
  } else {
    alert('Login failed. Please try again.') // You may want to display a more user-friendly message
  }
})

// Add this code to the end of app.js

// Handle message form submission
$('#messageForm').submit(function (event) {
  event.preventDefault()

  // Get the message
  const message = $('#messageInput').val().trim()

  // Send the message to the server
  if (message !== '') {
    socket.emit('sendMessage', message)
    $('#messageInput').val('')
  }
})

// Update the receiveMessage event handler in app.js

socket.on('receiveMessage', function (data) {
  const { username, message, timestamp } = data
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString()
  $('#messageContainer').append(
    `<p><strong>${username}</strong> (${formattedTimestamp}): ${message}</p>`
  )
})

// Add this code to the end of app.js

// Update online user list
socket.on('updateUserList', function (users) {
  $('#onlineUsers').empty()
  users.forEach(function (user) {
    $('#onlineUsers').append(`<li class="list-group-item">${user}</li>`)
  })
})
// Add this code to the end of app.js

// Handle logout button click
$('#logoutBtn').click(function () {
  // Emit logout event
  socket.emit('logout')
  // Hide chat section and show login form
  $('#chatSection').addClass('d-none')
  $('#loginForm').removeClass('d-none')
  window.location.reload()
})

// Listen for logout response
socket.on('logoutResponse', function () {
  console.log('Logout successful!')
})
