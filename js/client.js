const socket = io('http://localhost:8080');
const display = document.querySelector('.display');
let form = document.getElementById('msg-form');
let sendMsg = document.getElementById('send-msg')
let username = "";
while (username == "" || username == null) {
    username = prompt('enter your name to join')
}

let audio = new Audio('../image/whatsapp.mp3');
let heading = document.getElementById('user-name')
heading.innerText = `Welcome ${username}`;

function insert(message) {
    let block = document.createElement('div');
    block.classList.add('center');
    block.classList.add('joinedMsg');
    block.innerHTML = message;
    display.append(block);
    audio.play();
}

socket.emit('new-user', username);

// user joined the chat
socket.on('joined', name => {
    let message = `<strong>${name}</strong> joined the chat`;
    insert(message);
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let mesageToDeliver = sendMsg.value;
    if (sendMsg.value === "") {
        mesageToDeliver = ".";
    }
    let info = {
        name: 'You',
        message: mesageToDeliver,
        color: 'orange'
    };
    displayMsg(info, 'right');
    socket.emit('send', mesageToDeliver);
    sendMsg.value = "";
})


function displayMsg(info, pos) {
    let block = document.createElement('div');
    block.setAttribute('class', 'othersMsg');
    block.classList.add(pos);
    block.classList.add('msg');
    let span = document.createElement('div');
    span.style.fontSize = "13px";
    span.style.fontWeight = 'bold';
    span.innerText = info.name;
    span.style.color = info.color;

    let msgContainer = document.createElement('section');
    msgContainer.innerText = info.message;
    msgContainer.style.color = "whitesmoke";
    block.appendChild(span);
    block.appendChild(msgContainer);
    display.append(block);
    if (pos == 'left') {
        audio.play();
    }

}
socket.on('receive', info => {
    displayMsg(info, 'left');
});

socket.on('left-chat', name => {
    let message = `<strong>${name}</strong> left the chat`
    insert(message);
})