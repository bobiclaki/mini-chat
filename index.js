const express = require('express');
const app = express();
const { Server } = require('socket.io');
const path = require('path');

const PORT = process.argv[2] ? process.argv[2] : 1001;

const History = [];

app.use('/', express.static(path.join(__dirname, 'public')))

const server = app.listen(PORT, 'localhost', () => console.log(`CHAT: http://localhost:${PORT}`))

const io = new Server(server);
io.on('connection', socket => {

    socket.on('user:create', data => {
        socket.user = data;
        socket.emit('chat:loadHistory', History);
    })

    socket.on('chat:createMessage', message => {
        let _message = message.split(' ').map(x => {
            return `${x.replace(/\</g, `&lt;`).replace(/\>/g, `&gt;`)} `
        });
        let data = { content: _message, user: socket.user.username, date: Date.now() };
        History.push(data);
        io.emit('chat:addMessage', data);
    })

})