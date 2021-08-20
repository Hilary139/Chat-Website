const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userjoin, getcurrentuser, userleave, getRoomUsers} = require('./utils/users');

// inializing express , http , socket.io
const app = express(); // express
const server = http.createServer(app); // http
const io = socketio(server); // socket.io


// creating a port 
const PORT = 3000 || process.env.PORT;

// setting static folder
 app.use(express.static(path.join(__dirname, 'public')));

 // creating the bot name
const  botName = 'Ayisin Admin';

// run when a client connects 
io.on('connection', socket => {

    // sending notification of username and room joined
    socket.on('joinRoom', ({ username, room}) => {
        const user = userjoin(socket.id, username, room); 
    socket.join(user.room);


    // welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome To Ayisin-Connect!'));

    // Broadcast When A User Connect
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} Has Joined The Chat`));

    // send users and room information
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)

    });


    // broadcast when a user disconnects
    socket.on('disconnects', () => {
        const user = userleave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} Just Left The Chat`));


     // send users and room information
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)

    });

        }

    });

    });


    // listein for chatMessage
    socket.on('chatMessage', msg => {
         const user = getcurrentuser(socket.id);

         io.to(user.room).emit('message', formatMessage(user.username, msg));    
        });

});

// starting the server
server.listen(PORT, () => {
    console.log(`Localhost Listening On Port ${PORT}`)
});