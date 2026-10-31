const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is Running\n');
});

const wss = new WebSocket.Server({ server });
const MY_SECRET_TOKEN = "AuraXhub"; 

// Real list of brainrots
const brainrots = [
    "Bombardiro Crocodilo", "Tung Tung Sahur", "Lirili Larila", 
    "Ballerina Cappuccina", "Chimpanzini Bananini", "Brr Brr Patapim",
    "Trulimero Trulicina", "Glorbo Fruttodrillo", "Boneca Ambalabu",
    "Sahur Sahur", "Cappuccino Assassino"
];
const rarities = ["Common", "Rare", "Epic", "Mythic", "OG", "GOLD"];

wss.on('connection', (ws, req) => {
  if (!req.url.includes("token=" + MY_SECRET_TOKEN)) {
    ws.close();
    return;
  }
  console.log("Authorized client connected!");

  // Send READY signal
  let readyCount = 0;
  const readyInterval = setInterval(() => {
    ws.send(JSON.stringify([{ event: "connection.ready" }]));
    readyCount++;
    if (readyCount > 5) clearInterval(readyInterval);
  }, 1000);

  // Reply to Pings
  ws.on('message', (message) => {
    try {
      let parsed = JSON.parse(message);
      let data = Array.isArray(parsed) ? parsed[0] : parsed;
      if (data.event === "ping") {
        ws.send(JSON.stringify([{ event: "pong", nonce: data.nonce }]));
      }
    } catch (e) {}
  });

  // Send random FINDINGS every 4 seconds
  const interval = setInterval(() => {
    const randomName = brainrots[Math.floor(Math.random() * brainrots.length)];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    const randomIncome = Math.floor(Math.random() * 500000) + 1000;
    const fakeJobId = "ec368a3c-89db-4b9f-8be5-" + Math.random().toString(16).slice(2, 12);

    const payload = {
      event: "finding",
      data: {
        brainrot: { 
          name: `(daddy winded) [${randomRarity}] ${randomName}`, 
          income_per_second: randomIncome, 
          category: "OG" 
        },
        place_id: 109983668079237, 
        job_id: fakeJobId, 
        players: Math.floor(Math.random() * 12) + 1,
        observed_at_ms: Date.now()
      }
    };
    ws.send(JSON.stringify([payload]));
  }, 4000);

  ws.on('close', () => {
    clearInterval(interval);
    clearInterval(readyInterval);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
