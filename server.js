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

  // Send a fake "finding" every 5 seconds
  const interval = setInterval(() => {
    const payload = {
      event: "finding", // The leaked script requires this exact event name
      data: {
        brainrot: {
          name: "(daddy winded) Tralalero Tralala",
          income_per_second: Math.floor(Math.random() * 50000) + 1000,
          category: "OG" // Options: OG, Giga, Chud
        },
        place_id: game_place_id, // We will use the current place ID
        job_id: "ec368a3c-89db-4b9f-8be5-1d8dab6ec42d", // Fake Job ID for testing
        players: Math.floor(Math.random() * 12) + 1,
        observed_at_ms: Date.now()
      }
    };
    
    ws.send(JSON.stringify(payload));
  }, 5000);

  ws.on('close', () => clearInterval(interval));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
