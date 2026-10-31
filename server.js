const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is Running\n');
});

const wss = new WebSocket.Server({ server });
const MY_SECRET_TOKEN = "AuraXhub"; 

wss.on('connection', (ws, req) => {
  if (!req.url.includes("token=" + MY_SECRET_TOKEN)) {
    ws.close();
    return;
  }
  console.log("Authorized client connected!");

  // Send READY immediately
  ws.send(JSON.stringify([{
    event: "connection.ready"
  }]));

  // Handle Pings so it doesn't disconnect
  ws.on('message', (message) => {
    try {
      let parsed = JSON.parse(message);
      let data = Array.isArray(parsed) ? parsed[0] : parsed;
      
      if (data.event === "ping") {
        ws.send(JSON.stringify([{
          event: "pong",
          nonce: data.nonce
        }]));
      }
    } catch (e) {}
  });

  // Send FINDINGS
  const interval = setInterval(() => {
    const payload = {
      event: "finding",
      data: {
        brainrot: {
          name: "(daddy winded) Tralalero Tralala",
          income_per_second: 50000, 
          category: "OG"
        },
        place_id: 109983668079237, 
        job_id: "ec368a3c-89db-4b9f-8be5-1d8dab6ec42d", 
        players: 5,
        observed_at_ms: Date.now()
      }
    };
    ws.send(JSON.stringify([payload]));
  }, 5000);

  ws.on('close', () => clearInterval(interval));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
