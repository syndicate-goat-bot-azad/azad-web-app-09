/**
 * @author NTKhang
 *
 * ! The source code is written by NTKhang, please don't change the author's name everywhere.
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 *
 * Modified by Azad (Added keep-alive system for 24/7 uptime)
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ----------- Fake Web Server -----------
app.get("/", (req, res) => {
  res.send("✅ Goat Bot is running 24/7!");
});

// (Optional) Show logs from memory
let logs = [];
app.get("/logs", (req, res) => {
  res.json(logs.slice(-50)); // শেষ ৫০টা লগ দেখাবে
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
}, 5 * 60 * 1000); // প্রতি 5 মিনিটে নিজেকে পিং করবে
// -----------------------------------------------

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    logs.push(`[${new Date().toISOString()}] Bot exited with code ${code}`);
    if (code == 2) {
      log.info("Restarting Project...");
      startProject();
    }
  });

  child.on("error", (err) => {
    logs.push(`[${new Date().toISOString()}] Error: ${err.message}`);
  });
}

startProject();
