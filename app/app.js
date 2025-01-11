const websocket = new WebSocket("ws://localhost:8080");

websocket.onopen = () => {
    console.log("WebSocket opened");
    websocket.send("Hello from client");
}

websocket.onmessage = (event) => {
    console.log(`Message received by client: ${JSON.stringify(event.data)}`);
}

button = document.getElementById("submit-button");
inputText = document.getElementById("textfield");

button.addEventListener('click', (event) => {
    websocket.send(inputText.value);
});
