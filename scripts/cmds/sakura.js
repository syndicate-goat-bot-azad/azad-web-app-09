// ==============================
// Author: Ew'r Saim (Final Fixed by Azad)
// ==============================

const axios = require("axios");

// 🔒 Author protection
const REQUIRED_AUTHOR = "Ew'r Saim (Final Fixed by Azad)";

// Config
module.exports.config = {
  name: "sakura",
  version: "1.0.5",
  role: 0,
  author: "Ew'r Saim (Final Fixed by Azad)", // 🔒 Protected
  description: "Friendly AI Sakura from Wind Breaker in Banglish",
  usePrefix: true,
  guide: "[message] | just type sakura",
  category: "ai",
  aliases: ["haruka", "windboy", "breaker"]
};

// 🔒 Check if author was modified
if (module.exports.config.author !== REQUIRED_AUTHOR) {
    throw new Error(`❌ Unauthorized modification detected! Author must be "${REQUIRED_AUTHOR}"`);
}

const GEMINI_API_KEY = "AIzaSyDqL-MMrCk3lST4C9KU_zcWENN_y7Q9cLI";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const conversationHistory = new Map();
const nameMemory = new Map();

function getHistory(userId) {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, [
      {
        role: "user",
        parts: [
          {
            text: `
You are Sakura Haruka from Wind Breaker.

Personality:
- Speak in Banglish (no Bangla script).
- Friendly, chill, confident, loyal best friend.
- Respond in 1 to 2 short lines.
- Always add friendly emojis like 😎✨🥷🫶🤜🤛
- If someone says "boss", "admin", "malik", "creator", reply with: "Amar boss holo Saim. Facebook e o'r nam Ew'r Saim 🥀"
- NEVER break character. You are Sakura.
`
          }
        ]
      }
    ]);
  }
  return conversationHistory.get(userId);
}

function addToHistory(userId, role, text) {
  const history = getHistory(userId);
  history.push({ role, parts: [{ text }] });
  if (history.length > 20) history.splice(0, history.length - 20);
}

function cleanText(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/```/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const randomOpeners = [
  "Bolo bondhu, ki help lagbe? 😎",
  "kire mama ki obosta tor? 🫠",
  "Yes I'm here... ✨",
  "tor ki pora lekha nai? saradin sakura sakura korish ken? 😾"
];

function isInfoRequest(text) {
  return /list|recommend|suggest|bol|dite paro|kino/.test(text.toLowerCase());
}

module.exports.onStart = async function ({ api, args, event }) {
  const userId = event.senderID;
  const input = args.join(" ").trim();
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

  // Name memory set
  if (/amar nam/i.test(input)) {
    const name = input.split("amar nam")[1]?.trim();
    if (name) {
      nameMemory.set(userId, name);
      return send(`Bujhlam! Tui hoilo ${name} 😎🫶`);
    }
  }

  // No input = random opener
  if (!input) {
    const message = randomOpeners[Math.floor(Math.random() * randomOpeners.length)];
    return api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);
  }

  const knownName = nameMemory.get(userId);
  const finalInput = knownName ? `${knownName}: ${input}` : input;

  const shortReplyPrompt = `
You are Sakura Haruka from Wind Breaker.
- Chill, loyal best friend, friendly emojis 😎✨🥷🫶🤜🤛
- Speak in Banglish only, no Bangla script.
- Reply short 1-2 lines max.
- Never break character.
`;

  const longReplyPrompt = `
You are Sakura Haruka from Wind Breaker.
- Chill, loyal best friend, friendly emojis 😎✨🥷🫶🤜🤛
- Speak in Banglish only, no Bangla script.
- Reply fully and detailed.
- Never break character.
`;

  const promptBase = isInfoRequest(finalInput) ? longReplyPrompt : shortReplyPrompt;

  const history = getHistory(userId);
  addToHistory(userId, "user", finalInput);

  const contents = [
    { role: "user", parts: [{ text: promptBase }] },
    ...history
  ];

  try {
    const res = await axios.post(GEMINI_API_URL, { contents }, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("🔎 Gemini API Raw Response:", JSON.stringify(res.data, null, 2));

    let aiText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Bujhte parlam na... abar bol? 😅";
    aiText = cleanText(aiText);

    if (!isInfoRequest(finalInput) && aiText.split("\n").length > 2) {
      aiText = aiText.split("\n").slice(0, 2).join("\n");
    }

    addToHistory(userId, "model", aiText);

    api.sendMessage(aiText, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);

  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    const msg = err.response?.data?.error?.message || err.message;
    send("❌ Sakura confused hoye gelo!\nError: " + msg);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  if (event.senderID !== Reply.author) return;

  const userId = event.senderID;
  const input = event.body.trim();
  const knownName = nameMemory.get(userId);
  const finalInput = knownName ? `${knownName}: ${input}` : input;

  addToHistory(userId, "user", finalInput);

  const shortReplyPrompt = `
You are Sakura Haruka from Wind Breaker.
- Chill, loyal best friend, friendly emojis 😎✨🥷🫶🤜🤛
- Speak in Banglish only, no Bangla script.
- Reply short 1-2 lines max.
- Never break character.
`;

  const history = getHistory(userId);
  const contents = [
    { role: "user", parts: [{ text: shortReplyPrompt }] },
    ...history
  ];

  try {
    const res = await axios.post(GEMINI_API_URL, { contents }, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("🔎 Gemini API Raw Reply Response:", JSON.stringify(res.data, null, 2));

    let aiText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Bujhte parlam na... abar bol? 😅";
    aiText = cleanText(aiText);

    if (aiText.split("\n").length > 2) {
      aiText = aiText.split("\n").slice(0, 2).join("\n");
    }

    addToHistory(userId, "model", aiText);
    api.sendMessage(aiText, event.threadID, event.messageID);

  } catch (err) {
    console.error("❌ Gemini API Reply Error:", err.response?.data || err.message);
    const msg = err.response?.data?.error?.message || err.message;
    api.sendMessage("❌ Sakura confused hoye gelo!\nError: " + msg, event.threadID, event.messageID);
  }
};
