//Client side code

//Create the socket connection
const socket = io('http://localhost:8080');

//Socket on connection -> send message
socket.on('connect', () => {
    console.log("Socket connected with ID: " + socket.id);
})

//Socket on receiving message -> append to list
socket.on('message', (msg) => {
    console.log("Received a message from server");
    const e1 = document.createElement("li");
    e1.innerHTML = msg;
    document.querySelector('ul').append(e1);
})

//Send message upon clicking send button
document.getElementById('send').addEventListener('click', (e) => {
    const input = document.querySelector('input');
    socket.emit('message', input.value);
})

//Define a manual disconnect event
function disconnectClient() {
    socket.emit('disconnectClient', socket.id);
    console.log("Client manually requested disconnection");
}

//Trigger disconnect event by clicking on button
document.getElementById('disconnect').addEventListener('click', (e) => {
    disconnectClient();
})

//Disconnect upon window close
window.addEventListener('beforeunload', () => {
    socket.disconnect();
})
