const socket = io();
const chatMessage = document.querySelector('.chat-messages')
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// get username and room from url
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// join chatroom
socket.emit('joinRoom', {username, room});
console.log(username, room)


// get room and user
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});


// message from server 
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down when we get a message
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// messages submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //getting message text
    const msg = e.target.elements.msg.value;

     // emitting a message to the server
    socket.emit('chatMessage',msg);

    // Clear inputs
    e.target.elements.msg.value = ' ';
    e.target.elements.msg.focus();
    
})

// output message to DOM a
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}



// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map (user => `<li> ${user.username}</li>`).join(' ')}
    `;
}