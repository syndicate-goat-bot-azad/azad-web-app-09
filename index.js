/**
 * Goat Bot Single File Version
 * Author: NTKhang
 * Modified by: Azad (24/7 + Auto-restart + Error-proof + Render Optimized)
 */

const { spawn } = require("child_process");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------
// Logging System
// ---------------------
let logs = [];
function addLog(msg) {
  const timestamp = `[${new Date().toISOString()}]`;
  logs.push(`${timestamp} ${msg}`);
  if (logs.length > 50) logs.shift(); // keep max 50 logs
  console.log(msg);
}

// ---------------------
// Web Server (Keep-Alive)
// ---------------------
app.get("/", (req, res) => res.send("✅ Goat Bot is running 24/7!"));
app.get("/logs", (req, res) => res.json(logs));

app.listen(PORT, () => addLog(`🌐 Web server started on PORT: ${PORT}`));

// ---------------------
// Self-Ping (Render optimized)
// ---------------------
const url = `http://localhost:${PORT}`;
setInterval(async () => {
  try {
    await axios.get(url);
    addLog("🔄 Self-ping successful");
  } catch (err) {
    addLog(`⚠️ Self-ping failed: ${err.message}`);
  }
}, 60 * 1000); // ping every 1 minute

// ---------------------
// Goat Bot Main Code
// ---------------------
async function startGoatBot() {
  try {
    addLog("🚀 Starting Goat Bot...");

    // ===============================
    // 👉 Put your Goat.js code here 👇
    // ===============================

    console.log("🐐 Goat Bot core code is running...");

    // Example async loop (replace with your bot logic)
    setInterval(() => {
      console.log("💡 Goat Bot is still alive...");
    }, 10000);

    // ===============================
    // 👉 End of Goat.js code
    // ===============================

  } catch (err) {
    addLog(`❌ Error in Goat Bot: ${err.message}`);
    setTimeout(startGoatBot, 5000); // restart after 5s
  }
}

// ---------------------
// Global Error Handlers
// ---------------------
process.on("uncaughtException", (err) => addLog(`💥 Uncaught Exception: ${err.message}`));
process.on("unhandledRejection", (reason) => addLog(`💥 Unhandled Rejection: ${reason}`));

// ---------------------
// Start Bot
// ---------------------
startGoatBot();
