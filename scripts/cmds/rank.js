const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const axios = require("axios");
const GIFEncoder = require("gifencoder");

const dataFile = path.join(__dirname, "rankData.json");

// Load & save user data
function loadData() {
  if (!fs.existsSync(dataFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch {
    return {};
  }
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

let userExp = loadData();

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

module.exports = {
  config: {
    name: "rank",
    version: "4.1.0",
    author: "Azad",
    countDown: 5,
    role: 0,
    shortDescription: "Animated rank card GIF with smooth shimmer",
    longDescription: "Shows your exp, level, rank with stylish animated GIF",
    category: "game",
  },

  onChat: async function ({ event }) {
    const senderID = event.senderID;
    if (!userExp[senderID]) userExp[senderID] = 0;
    userExp[senderID] += 10;
    saveData(userExp);
  },

  onStart: async function ({ api, usersData, event }) {
    try {
      const { threadID, senderID, messageID } = event;

      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      let exp = userExp[senderID] || 0;
      let level = Math.floor(Math.sqrt(exp / 100));
      let nextLevelExp = (level + 1) ** 2 * 100;
      let currentLevelExp = level ** 2 * 100;
      let expNeed = nextLevelExp - exp;

      const sorted = Object.entries(userExp).sort((a, b) => b[1] - a[1]);
      let rankPos = sorted.findIndex(([id]) => id === senderID) + 1;

      let userName = "Unknown User";
      try {
        const userInfo = await api.getUserInfo(senderID);
        userName = userInfo[senderID]?.name || "Unknown User";
      } catch {}
      if (userName.length > 15) userName = userName.slice(0, 15) + "...";

      const avatarUrl = await usersData.getAvatarUrl(senderID);
      const avatarPath = path.join(tmpDir, `${senderID}.png`);
      const img = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(avatarPath, Buffer.from(img, "binary"));
      const avatarImg = await Canvas.loadImage(avatarPath);

      // GIF setup
      const width = 850;
      const height = 270;
      const encoder = new GIFEncoder(width, height);
      const gifPath = path.join(tmpDir, `rank_${senderID}.gif`);
      const gifStream = fs.createWriteStream(gifPath);
      encoder.createReadStream().pipe(gifStream);
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(80); // faster animation
      encoder.setQuality(10);

      const frames = 12; // smooth shimmer

      for (let i = 0; i < frames; i++) {
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // background
        let bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, "#1e1e2e");
        bgGradient.addColorStop(1, "#2a2a40");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // avatar glow pulse
        const glowAlpha = 0.3 + 0.2 * Math.sin((i / frames) * Math.PI * 2);
        ctx.save();
        ctx.beginPath();
        ctx.arc(120, 135, 90, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.shadowColor = `rgba(0,255,150,${glowAlpha})`;
        ctx.shadowBlur = 20;
        ctx.drawImage(avatarImg, 30, 45, 180, 180);
        ctx.restore();

        // username glow pulse
        ctx.font = "bold 32px Arial Black";
        ctx.shadowColor = `rgba(0,255,150,${glowAlpha})`;
        ctx.shadowBlur = 12 + 4 * Math.sin((i / frames) * Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(userName, 220, 60);
        ctx.shadowBlur = 0;

        // level, exp, rank
        ctx.font = "26px Arial";
        ctx.fillStyle = "#00ffcc";
        ctx.fillText(`Level: ${level}`, 220, 100);
        ctx.fillStyle = "#dddddd";
        ctx.fillText(`EXP: ${exp} / ${nextLevelExp}`, 220, 140);
        ctx.fillText(`Next Level in: ${expNeed} EXP`, 220, 175);
        ctx.fillStyle = "#ffcc00";
        ctx.fillText(`🏆 Rank: #${rankPos}`, 220, 210);

        // progress bar
        let barX = 220;
        let barY = 230;
        let barWidth = 580;
        let barHeight = 25;
        ctx.fillStyle = "#333";
        roundRect(ctx, barX
