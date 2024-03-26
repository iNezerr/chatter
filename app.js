// Initialize Socket.IO
const socket = io('http://localhost:3000')

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
  if (response.success) {
    // Redirect to chat page or perform other actions upon successful login
    console.log('Login successful!')
  } else {
    alert('Invalid username or password. Please try again.')
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

socket.on('receiveMessage', function(data) {
  const { username, message, timestamp } = data;
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString();
  $('#messageContainer').append(`<p><strong>${username}</strong> (${formattedTimestamp}): ${message}</p>`);
});


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
$('#logoutBtn').click(function() {
  // Emit logout event
  socket.emit('logout');
  // Hide chat section and show login form
  $('#chatSection').addClass('d-none');
  $('#loginForm').removeClass('d-none');
});

// Listen for logout response
socket.on('logoutResponse', function() {
  console.log('Logout successful!');
});
