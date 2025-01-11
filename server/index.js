const Websocket = require('ws')
const server = new Websocket.Server({ port: 8080 });
const { v4: uuidv4 } = require('uuid');

server.on('connection', (socket) => {
    socket.id = uuidv4();
    console.log(`Client connected: ${socket.id}`);
    socket.on('message', (message) => {
        console.log(`Message received from ${socket.id}: ${message}`);
        socket.send(`Server says: ${message}`);
    })
    socket.on('close', () => {
        console.log(`Client disconnected: ${socket.id}`);
    })
})
