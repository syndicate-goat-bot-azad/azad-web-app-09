/**
 * @author NTKhang
 * Modified by Azad
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

// ---------- Fake web server for Render / free hosting ----------
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("✅ Goat Bot is running!"));
app.listen(PORT, () => console.log(`🌐 Web server listening on port ${PORT}`));
// -------------------------------------------------------

function startProject() {
	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("exit", (code, signal) => {
		if (code !== 0) {
			log.info(`⚠️ Goat.js exited with code ${code} (signal: ${signal}), restarting...`);
			setTimeout(startProject, 3000); // 3 sec delay before restart
		} else {
			log.info("✅ Goat.js exited normally.");
		}
	});

	child.on("error", (err) => {
		log.error("❌ Failed to start Goat.js:", err);
		setTimeout(startProject, 5000); // retry after 5 sec if spawn fails
	});
}

// Start bot
startProject();
