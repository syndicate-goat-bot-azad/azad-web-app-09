/**
 * Optimized Goat Bot Main Launcher
 * Prevents memory leaks and limits restart loops
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- Fake Web Server ----------------
app.get("/", (req, res) => res.send("✅ Goat Bot is running 24/7!"));

// Show last 50 logs safely
let logs = [];
const MAX_LOGS = 50;
app.get("/logs", (req, res) => res.json(logs));

// Keep server listening
app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});
// -------------------------------------------------

// ---------------- Self-Ping ---------------------
const url = `http://localhost:${PORT}`;
setInterval(async () => {
  try {
    await axios.get(url);
    console.log("🔄 Self-ping to keep bot alive...");
  } catch (err) {
    console.error("⚠️ Self-ping failed:", err.message);
  }
}, 5 * 60 * 1000); // প্রতি 5 মিনিটে ping
// -------------------------------------------------

// ---------------- Child Process Launcher ----------------
let restartCount = 0;
const MAX_RESTARTS = 5; // একবারে max restart

function addLog(message) {
  const timestamp = `[${new Date().toISOString()}] ${message}`;
  logs.push(timestamp);
  if (logs.length > MAX_LOGS) logs.shift(); // শুধু শেষ ৫০টা লগ রাখবে
  console.log(timestamp);
}

function startProject() {
  if (restartCount >= MAX_RESTARTS) {
    addLog("⚠️ Max restarts reached. Bot will not restart automatically.");
    return;
  }

  restartCount++;
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    addLog(`Bot exited with code ${code}`);
    if (code === 2) {
      addLog("Restarting Project...");
      startProject();
    }
  });

  child.on("error", (err) => addLog(`Error: ${err.message}`));
}

// Launch bot
startProject();
