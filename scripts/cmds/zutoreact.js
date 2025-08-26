// Author: Azad

module.exports = {
  config: {
    name: "autoreact",
    version: "7.0",
    author: "Azad",
    countDown: 5,
    role: 0,
    shortDescription: "Ultimate Random Auto Reactions",
    longDescription: "Automatically reacts with multiple random nice emojis on hundreds of keywords.",
    category: "fun",
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    if (!event.body) return;
    const text = event.body.toLowerCase();

    // Keyword mapping + 5 random emojis each ✨
    const reactions = {
      "hi": ["👋", "😊", "🌸", "✨", "😄"],
      "hello": ["🌸", "✨", "😄", "👋", "🌟"],
      "hey": ["😄", "👋", "🌟", "✨", "😎"],
      "good morning": ["🌞", "☀️", "🌅", "🌻", "💛"],
      "gm": ["☀️", "🌞", "🌄", "🌸", "💫"],
      "good night": ["🌙", "😴", "🌌", "💤", "🌟"],
      "gn": ["🌌", "🌙", "💤", "✨", "💖"],
      "good afternoon": ["⛅", "☀️", "🌼", "🌞", "💛"],
      "good evening": ["🌆", "🌇", "✨", "💫", "🌙"],
      "i love you": ["❤️", "🥰", "💖", "💕", "💘"],
      "love": ["💘", "❤️", "💕", "💞", "💖"],
      "i miss you": ["🥺", "💔", "💖", "😭", "💞"],
      "miss": ["💔", "🥺", "💞", "😭", "💖"],
      "thank you": ["🙏", "💖", "🌸", "✨", "💫"],
      "thanks": ["💖", "🙏", "✨", "🌸", "💫"],
      "welcome": ["🙌", "🌸", "✨", "💞", "💫"],
      "congrats": ["🎉", "🌟", "🥳", "✨", "💫"],
      "happy": ["😁", "😄", "🌈", "✨", "💛"],
      "sad": ["😔", "😢", "💙", "💔", "🥺"],
      "angry": ["😡", "😤", "🔥", "💢", "😠"],
      "wow": ["🤩", "😲", "⭐", "✨", "💫"],
      "omg": ["😲", "🤯", "✨", "😳", "💫"],
      "bestie": ["🤗", "💞", "🫶", "💖", "✨"],
      "friend": ["🫶", "🤝", "💞", "💖", "✨"],
      "cute": ["🐼", "😻", "💖", "💞", "✨"],
      "sweet": ["🍬", "🍭", "💖", "✨", "🌸"],
      "baby": ["👶", "🍼", "💖", "✨", "🥰"],
      "bro": ["🤜🤛", "😎", "🔥", "💪", "✨"],
      "sis": ["👭", "💞", "✨", "🌸", "💖"],
      "ok": ["👌", "👍", "✨", "💫", "💖"],
      "yes": ["👍", "✅", "👌", "💫", "✨"],
      "no": ["🙅", "❌", "🚫", "💢", "😳"],
      "lol": ["😂", "🤣", "😆", "😹", "✨"],
      "haha": ["😆", "😹", "🤣", "😂", "✨"],
      "hahaha": ["🤣", "😂", "😹", "✨", "💫"],
      "yummy": ["😋", "🍔", "🍕", "🍟", "🍩"],
      "hungry": ["🍔", "🍟", "🍕", "🥪", "🥗"],
      "sleep": ["😴", "💤", "🌙", "✨", "🌌"],
      "tired": ["😪", "😴", "💤", "😓", "💫"],
      "party": ["🥳", "🎉", "🎊", "💃", "🕺"],
      "dance": ["💃", "🕺", "🎶", "✨", "💫"],
      "music": ["🎵", "🎶", "🎧", "🎤", "✨"],
      "song": ["🎶", "🎵", "🎤", "🎧", "💫"],
      "movie": ["🎬", "🍿", "📽️", "✨", "💫"],
      "oops": ["😅", "🙈", "😳", "💦", "✨"],
      "sorry": ["🙏", "😔", "💖", "💫", "✨"],
      "yay": ["🎊", "🥳", "✨", "💫", "🌟"],
      "good vibes": ["✨", "🌈", "💫", "💛", "🌸"],
      "cool vibes": ["😎", "✨", "🌟", "💫", "🌸"],
      "morning vibes": ["🌅", "🌞", "☀️", "💛", "🌸"],
      "evening vibes": ["🌇", "🌆", "✨", "💫", "🌙"],
      "sweet dreams": ["🌙", "💤", "🌌", "✨", "💖"],
      "thankful": ["💖", "🙏", "🌸", "✨", "💫"],
      "blessed": ["🙏", "✨", "💫", "🌟", "💖"],
      "friendship": ["🤝", "💞", "🫶", "💖", "✨"],
      "best friends": ["💞", "🤗", "🫶", "✨", "🌸"],
      "perfect": ["🌟", "✨", "💯", "💖", "💫"],
      "amazing": ["✨", "🌟", "🔥", "💫", "💖"],
      "wowow": ["🤩", "😲", "⭐", "💫", "✨"]
      // আরও keyword এড করা যাবে চাইলে
    };

    for (const [keyword, emojis] of Object.entries(reactions)) {
      if (text.includes(keyword)) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        return api.setMessageReaction(randomEmoji, event.messageID, () => {}, true);
      }
    }
  }
};
