//Server side code

//Create an http server
const http = require("http").createServer();

//Create socket
const io = require("socket.io")(http, {
    cors: {origin: '*'}
});

//For saving joining clients
const clients = [];
let userIdCount = 0;

io.on("connection", socket => {
    console.log("Client connectedd with socket id: " + socket.id);
    const userId = userIdCount++;
    //Update client information
    clients.push({
        userId: userId,
        socketId: socket.id
    })

    //Output available client info
    console.log("=====")
    console.log("remaining client ids are: ");
    clients.forEach(
        (element)=> {
            console.log(element.userId);
        });
    console.log("=====")

    //On receiving a message, emit to all participants -> Group chat
    socket.on('message', (data) => {
        console.log(`Receivedd ${data}`);
        io.emit("message", `${socket.id.substring(0,2)} says ${data}`);
    })

    //Handle disconnect event -> delete the socket ide form the client list
    socket.once('disconnect', () => {
        const index = clients.findIndex(socket => socket.id === socket.id);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log("Client disconnected with socket id: " + socket.id);
    })

    //Handle the custom (manual) disconnect event
    socket.on('disconnectClient', (id) => {
        const client = clients.find(client => client.socketId === id);
        if (client) {
            io.sockets.sockets.get(id).disconnect();
        }
    });
})

http.listen(8080, () => { console.log("Listening on port 8080"); });
