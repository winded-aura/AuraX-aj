const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is Running\n');
});

const wss = new WebSocket.Server({ server });
const MY_SECRET_TOKEN = "AuraXhub"; // YOUR PASSWORD

wss.on('connection', (ws, req) => {
  if (!req.url.includes("token=" + MY_SECRET_TOKEN)) {
    ws.close();
    return;
  }
  console.log("Authorized client connected!");

  // NEW: Send a brainrot every 5 seconds to the Roblox client
  const interval = setInterval(() => {
    const brainrot = {
      name: "Tralalero Tralala",
      income: Math.floor(Math.random() * 50000) + 1000,
      jobId: "ec368a3c-89db-4b9f-8be5-1d8dab6ec42d", // Replace with real job IDs later
      isGold: Math.random() < 0.2 // 20% chance to be gold
    };
    ws.send(JSON.stringify(brainrot));
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});