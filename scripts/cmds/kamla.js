const fs = require("fs");
const path = __dirname + "/cache/kamlaOn.json";

const OWNER_ID = "61578365162382"; // তোমার ফেসবুক আইডি এখানে বসাও

module.exports = {
  config: {
    name: "kamla",
    version: "1.0",
    author: "Amit Max ⚡",
    description: "Tag someone to kamla-mode and insult them automatically when they chat",
    category: "fun",
    usages: "[on/off @tag]",
    cooldowns: 5,
    role: 0,
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions, senderID } = event;

    // এখন শুধুমাত্র OWNER_ID ইউজ করতে পারবে
    if (senderID !== OWNER_ID) {
      return api.sendMessage(
        "এইটা কি তোর বাপের command নাকি রে? 🤬 হুদাই kamla করতে আসছোস! এইটা শুধুমাত্র 🅰🆉🅰🅳 ভাই চালায়, বুঝছস? 🫡",
        threadID,
        messageID
      );
    }

    if (!fs.existsSync(path)) fs.writeFileSync(path, "[]", "utf-8");
    let kamlaList;
    try {
      kamlaList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      kamlaList = [];
    }

    if (args.length === 0) {
      return api.sendMessage(
        `⚠️ ব্যবহার:\n.kamla on @user - কামলা মোড চালু করবে\n.kamla off - কামলা মোড বন্ধ করবে`,
        threadID,
        messageID
      );
    }

    const command = args[0].toLowerCase();

    if (command === "off") {
      const updatedList = kamlaList.filter(e => e.threadID !== threadID);
      fs.writeFileSync(path, JSON.stringify(updatedList, null, 2), "utf-8");
      return api.sendMessage(
        "🥱 কামলা মোড এখন বন্ধ! কেউ গালি পাবে না।",
        threadID,
        messageID
      );
    }

    if (command === "on") {
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage(
          "🤓 কারো নাম ট্যাগ করো যাকে কামলা মোডে রাখতে চাও।",
          threadID,
          messageID
        );
      }

      const mentionID = Object.keys(mentions)[0];

      const exists = kamlaList.some(
        e => e.threadID === threadID && e.userID === mentionID
      );

      if (exists) {
        return api.sendMessage(
          `😒 ${mentions[mentionID].replace("@", "")} তো আগেই কামলা মোডে আছে!`,
          threadID,
          messageID
        );
      }

      kamlaList.push({ threadID, userID: mentionID });
      fs.writeFileSync(path, JSON.stringify(kamlaList, null, 2), "utf-8");

      return api.sendMessage(
        `😈 ${mentions[mentionID].replace("@", "")} এখন থেকে কামলা মোডে! কথা বললেই গালি পাবে!`,
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      `⚠️ ব্যবহার:\n.kamla on @user - কামলা মোড চালু করবে\n.kamla off - কামলা মোড বন্ধ করবে`,
      threadID,
      messageID
    );
  },

  onChat: async function({ api, event }) {
    if (!event.isGroup) return;

    if (!fs.existsSync(path)) return;

    let kamlaList;
    try {
      kamlaList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      kamlaList = [];
    }

    const isKamla = kamlaList.some(
      e => e.threadID === event.threadID && e.userID === event.senderID
    );

    if (!isKamla) return;

    const insults = [
  "চুপ শালা, তোর কথায় ডায়াল আপ কান্না করে! 😭📞",
  "তুই এতটা ভোদাই, তোকে দিয়ে QR কোড স্ক্যান হলেও ভুল URL আসে 🥴",
  "শোন বলদ, তোকে দেখেই সিম কোম্পানি slow নেট দেয় 😑📶",
  "তুই হইছিস সেই পাগল, যারে দেখলে ম্যাড ডাক্তার পালায় 🏃‍♂️💉",
  "তোরে লজ্জা বলে কিছু আছে, না সেটাও uninstall? 📱🫢",
  "তুই joke মারলি তো হসপিটালে bed full 😂🛏️",
  "তোর কাজ কারবার দেখে বলাই যায় তুই AI এর দুঃস্বপ্ন 🤖🌙",
  "তুই এমন বলদ, গরুদের মনেও questions জাগে 🐄❓",
  "শালা তুই তো বাস্তবের roaming charge 😤📲",
  "তোরে গালি দিলেও গালিটা অপমানিত হয় 😪",
  "তোর বুদ্ধি দিয়ে light জ্বালানো যায় – মানে fuse 😆💡",
  "তুই এমন ভোদাই, দুধেও ভেজাল খুঁজে পাবি না 🥛❌",
  "তুই মানে হাঁটার আগেই হোঁচট খাওয়া বিশেষ প্রাণী 🐾",
  "তোর অবস্থা এমন, বেকুবরাও তোকে বোকা ভাবে 😭",
  "তোর মতন বলদরা থাকলে ছাতার নিচেও রোদ লাগে ☂️🔥",
  "তুই এমন পলাপান, যারে বই পড়তে দিলে বই উল্টে পালায় 📚🏃",
  "তোর ফেইস দেখে ফেসবুকই deactivate হয় 📵😨",
  "তুই এমন চিনচিনে, দইতেও লবণ লাগে তোর পাশে 😒",
  "তুই হইছিস সেই ফ্লেভার, যারে মুখে দিলেই জিভ গলায় ঢুকে যায় 😬",
  "শালা তুই এত বেকুব, তোর ফোনেও keypad কাঁদে 😢📲",
  "তোরে দেখলে কবি inspiration ভুলে যায় 📝😶",
  "তুই মানে ‘Ignore List’ এর প্রধান সদস্য 🙄",
  "তুই joke মারিস, তাতে হোয়াইট হাউসে জরুরি মিটিং বসে 🤷‍♂️🇺🇸",
  "তুই পেছনে দাঁড়ালেই সেলফি ক্যামেরা ধোঁয়া ছাড়ে 📸💨",
  "তুই মানে ভুলে যাওয়া password-এর embodiment 🔑😵‍💫",
  "তুই এমন বদমাইশ, জারজরাও তোকে ‘না ভাই, আমি ভালো’ বলে 🧬",
  "তোর চিন্তা করতেই calculator গরম হয়ে যায় 🔢🔥",
  "তুই হলি walking nonsense – থেমেও বুঝে না 🤯",
  "তোর মত বলদে বুদ্ধি দিলে ভূতও হোঁচট খায় 👻",
  "তোর profile দেখে antivirus ভাইরাস ধরতে ভুলে যায় 😈🦠",
  "তুই এমন ডাঁশ, মশারাও তোরে bite করতে ভয় পায় 🦟😷",
  "তুই তো শালা এমন রসিক, comedian রা তোকে blacklist করেছে 😂📝",
  "তোরে দেখলে মনে হয় জ্ঞান ছুটিতে গেছে 🌴📚",
  "তুই এমন ভোদাই, spell check-ও তোকে skip করে 📝🚫",
  "তুই নিজেই একটা bug 🐛, আপডেটেও ঠিক হবি না 😩",
  "তোরে দেখে মনে হয় ‘brain.exe has stopped working’ 💻❌",
  "তুই এমন একটা বলদ, তোকে ignore করাও time waste 😬",
  "তুই joke মারিস, তাতে লোকজন অনলাইন থেকে অফলাইন হয়ে যায় 💀",
  "তুই এতটাই পাগল, তোকে বাঁচাতে asylum-ও deny করে 🏥🚷",
  "তুই এমন slow, তোর ছায়াও আগে পৌঁছে যায় 🐢💨",
  "তুই এমন confused, mirror এও নিজেরে চিনিস না 🪞❓",
  "তুই এমন annoying, mosquito coil তোকে ছুঁতে চায় না 😒🦟",
  "তোর দৃষ্টিতে এত কষ্ট, লেন্স নিজেই ফেটে যায় 👓💔",
  "তুই joke করলেই ChatGPT log out করে 🤖🚪",
  "তোর IQ এত কম, তোরে দেখে 0-ও superior মনে হয় 0️⃣",
  "তুই হইছিস live example – ‘how not to exist’ 🧍🚫",
  "তোরে কানে শুনলে speaker ব্লক হয়ে যায় 🔇",
  "তুই একমাত্র মানুষ, যারে troll করেও troll মাফ চায় 😭",
  "তুই পিক দিলে screen protector নিজেই উঠিয়ে নেয় 📱😵‍💫",
  "তুই এমন face, যারে দেখে ghost বলে – দোস্ত, ভয় পাই 😨👻",
];
    const insult = insults[Math.floor(Math.random() * insults.length)];
    return api.sendMessage(insult, event.threadID, event.messageID);
  }
};
