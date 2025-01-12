//Server side code

//Create an http server
const http = require("http").createServer();

//Create socket
const io = require("socket.io")(http, {
    cors: {origin: '*'}
});

//For saving joining clients
const clients = [];

io.on("connection", socket => {
    console.log("Client connectedd with socket id: " + socket.id);
    const userId = socket.handshake.query.userId;
    //Update client information
    clients.push({
        userId: userId,
        socketId: socket.id
    })

    //Output available client info
    console.log("=====")
    console.log("Client ids are: ");
    clients.forEach(
        (element)=> {
            console.log(element.userId);
        });
    console.log("=====")

    io.emit("clients", clients);

    //On receiving a message
    socket.on('message', (data) => {
        console.log(`Receivedd ${data.userId}, ${data.message}`);

        // io.emit("message", `${socket.id.substring(0,5)} says ${data}`); //This is send to all

        //Send to selected user only
        const client = clients.find(client => client.userId === data.userId);
        console.log(client.userId, client.socketId);
        if (client) {
            io.to(client.socketId).emit("message", data.message);
            console.log("Private message send to userId " + client.userId + " with socket ID " + client.socketId);
        } else {
            console.log('No user found');
        }

    })

    //Handle disconnect event -> delete the socket ids form the client list
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
