/**
 * Optimized Bootstrap for Goat Bot V2 (Render-friendly)
 * Author: Az ad
 */

const path = require("path");
const fs = require("fs-extra");
const http = require("http");
const express = require("express");

// Minimal web server for health checks/keep-alive
const app = express();
app.get("/", (_req, res) => res.send("Goat Bot V2 is running (optimized)."));
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => console.log("[WEB] Listening on", PORT));

// --- Core Client Skeleton (replace with your actual Goat Bot client init) ---
const client = { commands: new Map(), events: new Map(), config: {} };

// Load config fast (sync read; tiny file)
const localConfigPath = path.join(__dirname, "config.json");
if (fs.existsSync(localConfigPath)) {
  try {
    client.config = JSON.parse(fs.readFileSync(localConfigPath));
  } catch (e) {
    console.warn("[CONFIG] Failed to parse config.json:", e.message);
  }
}

// Lazy command loader
const loadCommands = require("./loader");
loadCommands(client);

// Deferred init for heavy or external steps
(async () => {
  console.time("bootstrap");

  // 1) Load remote base API URL with cache (non-blocking for HTTP server)
  const { getBaseApiUrl } = require("./utils/cacheBaseUrl");
  try {
    client.config.baseApiUrl = await getBaseApiUrl();
    console.log("[API] baseApiUrl:", client.config.baseApiUrl);
  } catch (e) {
    console.warn("[API] baseApiUrl failed:", e.message);
  }

  // 2) Initialize core subsystems (simulate Goat Bot internals)
  // NOTE: Replace with the real init of your framework (login, sockets, etc.)
  try {
    const { initCore } = require("./utils/initCore");
    await initCore(client);
    console.log("[CORE] Initialized.");
  } catch (e) {
    console.error("[CORE] Init failed:", e);
  }

  console.timeEnd("bootstrap");
})();

// Example message dispatcher (pseudo; connect to your real message events)
async function onMessage(message) {
  try {
    const prefix = client.config.prefix || "/";
    if (!message.text?.startsWith(prefix)) return;
    const [cmdName, ...args] = message.text.slice(prefix.length).trim().split(/\s+/);

    const loader = client.commands.get(cmdName);
    if (!loader) return; // unknown command

    // Require on first use (lazy)
    const command = loader();
    if (typeof command.run !== "function") return;

    await command.run({ client, message, args });
  } catch (e) {
    console.error("[DISPATCH] Error:", e);
  }
}

// Export dispatcher for your adapter to call
module.exports = { client, onMessage };
