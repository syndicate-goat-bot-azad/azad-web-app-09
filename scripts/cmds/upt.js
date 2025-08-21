// Author: Raihan Fiba | Modified by Azad

const os = require("os");
const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uptime",
    version: "2.1",
    author: "Raihan Fiba | Modified by Azad",
    countDown: 5,
    role: 0,
    shortDescription: "Cute uptime with red glowing circles & text",
    longDescription: "Show uptime, CPU, RAM with glowing red visuals at bottom and glowing text",
    category: "system",
    guide: { en: "uptime" }
  },

  onStart: async function ({ api, event }) {
    try {
      const timeNow = moment.tz("Asia/Dhaka");
      const session = getTimeSession(timeNow.hour());

      // ⏱ Uptime
      const uptimeSeconds = process.uptime();
      const uptimeHours = Math.floor(uptimeSeconds / 3600);
      const uptimePercent = Math.min((uptimeSeconds / (12 * 3600)) * 100, 100);

      // 👥 Group & User Info
      const gcInfo = await api.getThreadInfo(event.threadID);
      const gcName = gcInfo.threadName || "Group Chat";
      const botName = "🥷ᴀᴢᴀᴅ ᶜʰᵃᵗ ʙᴏᴛ🤖 🌷";
      const senderName = (await api.getUserInfo(event.senderID))[event.senderID]?.name || "User";

      // 💻 System Info
      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const cpuLoad = os.loadavg()[0];

      // 🖼 Background Image
      const bg = await loadImage("https://i.imgur.com/ySMvIub.jpeg");

      const canvas = createCanvas(800, 500);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // 👤 Group Avatar
      try {
        const res = await axios.get(
          `https://graph.facebook.com/${event.threadID}/picture?height=720&width=720`,
          { responseType: "arraybuffer" }
        );
        const gcAvatar = await loadImage(Buffer.from(res.data));
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 100, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(gcAvatar, 40, 40, 120, 120);
        ctx.restore();
      } catch {
        console.error("⚠ Group avatar not loaded, skipping.");
      }

      // 📝 Info Text with Glow
      ctx.font = "22px Arial";
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#ff0000";   // 🔴 Glow color
      ctx.shadowBlur = 15;           // 🌟 Glow intensity
      let y = 200, lh = 36;
      ctx.fillText(`👥 Group: ${gcName}`, 40, y); y += lh;
      ctx.fillText(`🤖 Bot: ${botName}`, 40, y); y += lh;
      ctx.fillText(`👤 User: ${senderName}`, 40, y); y += lh;
      ctx.fillText(`🕓 Time: ${timeNow.format("hh:mm A")} (${session})`, 40, y); y += lh;
      ctx.fillText(`📅 Date: ${timeNow.format("DD MMM YYYY")}`, 40, y); y += lh;
      ctx.shadowBlur = 0; // reset shadow

      // 🔴 Glowing Circles (Uptime, CPU, RAM)
      const baseY = 400;
      drawGlowingCircle(ctx, 300, baseY, 40, uptimePercent, "Uptime", `${uptimeHours}h`);
      drawGlowingCircle(ctx, 400, baseY, 40, Math.min(cpuLoad * 10, 100), "CPU", `${cpuLoad.toFixed(1)}%`);
      drawGlowingCircle(ctx, 500, baseY, 40, (usedMem / totalMem) * 100, "RAM", `${usedMem.toFixed(1)}G`);

      // 📂 Save File
      fs.ensureDirSync(`${__dirname}/cache`);
      const path = `${__dirname}/cache/uptime-${event.senderID}.png`;
      fs.writeFileSync(path, canvas.toBuffer());

      // 📤 Send
      return api.sendMessage({
        body: `✨ Bot - 🥷ᴀᴢᴀᴅ ᶜʰᵃᵗ ʙᴏᴛ🤖 🌷\n👑 Admin - 🅰🆉🅰🅳`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);

    } catch (err) {
      console.error("❌ Uptime command error:", err);
      return api.sendMessage("⚠ Something went wrong while generating uptime card.", event.threadID);
    }
  }
};

// 🌅 Session by time
function getTimeSession(hour) {
  if (hour >= 4 && hour < 10) return "Morning";
  if (hour >= 10 && hour < 14) return "Noon";
  if (hour >= 14 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 20) return "Evening";
  return "Night";
}

// 🔴 Draw Circle with Glow
function drawGlowingCircle(ctx, x, y, radius, percent, label, value) {
  const angle = (percent / 100) * Math.PI * 2;

  ctx.save();
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 20;

  // Background Circle
  ctx.beginPath();
  ctx.strokeStyle = "#4c4c4c";
  ctx.lineWidth = 6;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Red Arc
  ctx.beginPath();
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 6;
  ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + angle);
  ctx.stroke();

  ctx.restore();

  // 🔤 Text with glow
  ctx.save();
  ctx.font = "15px Arial";
  ctx.fillStyle = "#ff4444";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 15;
  ctx.fillText(label, x, y - 10);
  ctx.font = "bold 18px Arial";
  ctx.fillText(value, x, y + 20);
  ctx.restore();
                                  }
