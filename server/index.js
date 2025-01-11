const Websocket = require('ws')
const server = new Websocket.Server({ port: 8080 });

server.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('message', (message) => {
        console.log(`Server log: ${message}`);
        socket.send(`Server says: ${message}`);
    })
})
