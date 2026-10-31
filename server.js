const WebSocket = require('ws');
const http = require('http');

// 1. Create HTTP server (Koyeb requires this to stay awake)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is Running\n');
});

const wss = new WebSocket.Server({ server });

// 2. YOUR SECRET PASSWORD (Change this to whatever you want!)
const MY_SECRET_TOKEN = "AuraXhub";

wss.on('connection', (ws, req) => {
  // 3. Check if the Roblox script sent the correct password in the URL
  if (!req.url.includes("token=" + MY_SECRET_TOKEN)) {
    ws.close(); // Kick out anyone without the password
    console.log("Unauthorized connection rejected.");
    return;
  }

  console.log("Authorized client connected!");

  // 4. When you send a message, the server replies
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    ws.send("Server received your message: " + message);
  });
});

// 5. Start the server on the port Koyeb provides
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});