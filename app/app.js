//Client side code
const dropDown = document.getElementById('users');
dropDown.innerHTML = '';

const messages = document.getElementById('messages');
const input = document.querySelector('input');
const sendButton = document.getElementById('send');
const disconnectButton = document.getElementById('disconnect');

// Function to generate a random alphanumeric string
function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Generate a random userId
const userId = generateRandomString(4);

//Create the socket connection
const socket = io('http://localhost:8080', {
    query : { userId: userId },
});

//Socket on connection -> send message
socket.on('connect', () => {
    console.log("Socket connected with ID: " + socket.id);    
})

socket.on('clients', (clients) => {
    dropDown.innerHTML = '';
    clients.forEach(client => {
        console.log(`${client.userId} , ${client.socketId}`);
        const option = document.createElement("option");
        option.value = client.userId;
        option.textContent = `User ${client.userId}`;
        dropDown.append(option);
    })
})



//Socket on receiving message -> append to list
socket.on('message', (msg) => {
    console.log("Received a message from server");
    const e1 = document.createElement("li");
    e1.innerHTML = msg;
    messages.append(e1);
})

//Send message upon clicking send button
sendButton.addEventListener('click', (e) => {
    // socket.emit('message', input.value); // This is send to all
    //This is send to selected user only
    if (dropDown && dropDown.value) {
        const data = {
            userId: dropDown.value,
            message: input.value
        };
        socket.emit('message', data);
    } else {
        console.error('No user selected or dropDown element not found');
    }
})

//Define a manual disconnect event
function disconnectClient() {
    socket.emit('disconnectClient', socket.id);
    console.log("Client manually requested disconnection");
}

//Trigger disconnect event by clicking on button
disconnectButton.addEventListener('click', (e) => {
    disconnectClient();
})

//Disconnect upon window close
window.addEventListener('beforeunload', () => {
    socket.disconnect();
})
