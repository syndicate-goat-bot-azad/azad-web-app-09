/**
 * @author NTKhang
 * Modified by Azad (Added keep-alive system for 24/7 uptime)
 */

const express = require("express");
const axios = require("axios");
const log = require("./logger/log.js");
const GoatBot = require("./Goat.js"); // Assuming Goat.js exports a function to start

const app = express();
const PORT = process.env.PORT || 3000;

// ----------- Fake Web Server -----------
app.get("/", (req, res) => {
  res.send("✅ Goat Bot is running 24/7!");
});

// (Optional) Show logs from memory
let logs = [];
app.get("/logs", (req, res) => {
  res.json(logs.slice(-50));
});

app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});
// ---------------------------------------

// ----------- Self-Ping (Keep Alive) -----------
const url = `http://localhost:${PORT}`;
setInterval(async () => {
  try {
    await axios.get(url);
    console.log("🔄 Self-ping to keep bot alive...");
  } catch (err) {
    console.error("⚠️ Self-ping failed:", err.message);
  }
}, 5 * 60 * 1000);
// -------------------------------------------

// ----------- Start Bot with Error Handling -----------
async function startBot() {
  while (true) {
    try {
      console.log("🤖 Starting Goat Bot...");
      await GoatBot(); // Ensure Goat.js exports an async function
      console.log("⚠️ Goat Bot stopped unexpectedly. Restarting in 5s...");
      await new Promise(r => setTimeout(r, 5000));
    } catch (err) {
      console.error("❌ Error in Goat Bot:", err.message);
      logs.push(`[${new Date().toISOString()}] Error: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

startBot();
