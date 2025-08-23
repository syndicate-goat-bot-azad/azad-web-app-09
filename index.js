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
  if (logs.length > 50) logs.shift(); // keep maximum 50 logs
  console.log(msg); // you can reduce console logs if needed
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
}, 1 * 60 * 1000); // ping every 1 minute

// ---------------------
// Goat.js Internal Error-Proof Wrapper
// ---------------------
function wrapAsync(fn) {
  return async function(...args) {
    try {
      await fn(...args);
    } catch (err) {
      addLog(`❌ Goat.js internal error: ${err.message}`);
    }
  };
}

// ---------------------
// Example Goat Bot Main Function
// ---------------------
async function GoatBotMain() {
  // place your main Goat Bot code here
  try {
    await exampleTask();
    await anotherTask();
  } catch (err) {
    addLog(`⚠️ GoatBotMain error: ${err.message}`);
  }
}

// Example async functions
async function exampleTask() {
  try {
    console.log("✅ Example task running");
  } catch (err) {
    addLog(`⚠️ exampleTask error: ${err.message}`);
  }
}

async function anotherTask() {
  try {
    console.log("✅ Another task running fine");
  } catch (err) {
    addLog(`⚠️ anotherTask error: ${err.message}`);
  }
}

// Wrap GoatBotMain
const safeGoatBot = wrapAsync(GoatBotMain);

// ---------------------
// Auto-Restart System
// ---------------------
function startBot() {
  const child = spawn("node", ["-e", `"(${safeGoatBot.toString()})()"`], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    addLog(`⚠️ Goat Bot exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(startBot, 5000);
  });

  child.on("error", (err) => {
    addLog(`❌ Goat.js spawn error: ${err.message}`);
  });
}

// ---------------------
// Global Error Handlers
// ---------------------
process.on("uncaughtException", (err) => addLog(`💥 Uncaught Exception: ${err.message}`));
process.on("unhandledRejection", (reason) => addLog(`💥 Unhandled Rejection: ${reason}`));

// ---------------------
// Start Bot
// ---------------------
startBot();
