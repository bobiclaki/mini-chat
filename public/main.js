const socket = io();

let username = prompt('Enter your username:', localStorage['username'] ? localStorage['username'] : '');
localStorage.setItem('username', username);

function addMessage(message) {
    let newMessage = document.createElement('li');
    newMessage.innerHTML = `
<li>
    <div class="header">${message.user}</div>
    <div class="content">${message.content}</div>
</li>`;
    return document.querySelector('.messages').append(newMessage);
}

document.querySelector('.textbox').addEventListener('keyup', event => {
    if (event.keyCode === 13 && event.target.value.trim() !== '') {
        socket.emit('chat:createMessage', event.target.value);
        event.target.value = '';
    }
})

socket.emit('user:create', { username });

socket.on('chat:loadHistory', history => {
    for (let message of history) addMessage(message);
})

socket.on('chat:addMessage', message => {
    addMessage(message);
})