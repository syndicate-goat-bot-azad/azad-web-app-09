/**
 * @author NTKhang
 * Modified by Azad for robust error handling
 */

process.on('unhandledRejection', error => console.error("❌ Unhandled Rejection:", error));
process.on('uncaughtException', error => console.error("❌ Uncaught Exception:", error));

(async () => {
	try {
		// ===== Place your original Goat.js code here =====

		const axios = require("axios");
		const fs = require("fs-extra");
		const google = require("googleapis").google;
		const nodemailer = require("nodemailer");
		const { execSync } = require('child_process');
		const log = require('./logger/log.js');
		const path = require("path");

		// Entire original Goat.js logic, including:
		// - global.GoatBot setup
		// - config loading
		// - watchAndReloadConfig
		// - Gmail setup
		// - version check
		// - login

		require(`./bot/login/login${process.env.NODE_ENV === 'development' ? '.dev.js' : '.js'}`);

		// ===== End original Goat.js code =====

		console.log("✅ Goat Bot initialized successfully!");

	} catch (err) {
		console.error("❌ Error during bot initialization:", err);
		// Exit so parent process can restart
		process.exit(1);
	}
})();
