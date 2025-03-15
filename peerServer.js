const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
  allow_discovery: true, // Allows peers to discover each other
});

peerServer.on("connection", (client) => {
  console.log(`✅ New Peer Connected: ${client.id}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`❌ Peer Disconnected: ${client.id}`);
});

console.log("🚀 PeerJS Server is running on port 9000...");
