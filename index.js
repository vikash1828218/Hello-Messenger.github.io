const io = require('socket.io')(8080, {
    cors: {
        origin: '*',
    }
});

const colorarr = ['rgb(255, 208, 0)', 'gold', 'orange', 'violet', 'greenyellow', 'goldenrod'];
const users = {};
const color = {};
let idx = 0;
io.on('connect', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        color[socket.id] = colorarr[idx % 6];
        idx += 1;
        socket.broadcast.emit('joined', name);
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', { name: users[socket.id], message: message, color: color[socket.id] });
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left-chat', users[socket.id]);
        delete users[socket.id];
    })

})