module.exports.config = {
    name: "chudi",
    version: "1.0",
    role: 1,
    author: "Mesbah Bb'e",
    description: "5 বারের জন্য ক্রমাগত বন্ধুর ট্যাগ ট্যাগ করুন\nসেই ব্যক্তিকে আত্মা কলিং বলা যেতে পারে",
    category: "nsfw",
    guide: "please @mention",
    coolDown: 10
}

module.exports.onStart = async function({ api, args, Users, event }) {
    var mention = Object.keys(event.mentions)[0];
    const broder = "_____________________________";

    if (!mention) return api.sendMessage(`${broder}\nভাতিজা খানকির পোলারে একটা মেনশন দে আমার বস আজাদ ভালোবাসা দিবে-!! 😏🔥\n${broder}`, event.threadID);

    let name = event.mentions[mention];
    var arraytag = [{ id: mention, tag: name }];

    var a = function(msg) { 
        if (typeof msg === "string") {
            api.sendMessage(`${broder}\n${msg}\n${broder}`, event.threadID);
        } else {
            api.sendMessage({
                body: `${broder}\n${msg.body}\n${broder}`,
                mentions: msg.mentions
            }, event.threadID);
        }
    }

    a("চুদা Start 💦🍑");

    const messages = [
        "ভোদাই জানে চোদার মজা তোর মাকে জিজ্ঞেস কর কেমন দিছিলাম চোদা 😈💋 " + name,
        "খাংকির পোলা তর কচি বোন রে চুদি 😍🔥 " + name,
        "মাদারচোদ তর আম্মু পম পম খাংকির পো 💖 " + name,
        "খাংকির পোলা তর কচি ভুদায় ভুদায় কামর দিমু 😏💦 " + name,
        "খাংকি মাগির পোলা কথা ক কম কম তর আম্মু রে চুদে বানামু 💘 " + name,
        "depression থেকেও তর মাইরে চু*** দি 😎💋 " + name,
        "তর আম্মু রে আচার এর লোভ দেখিয়ে আমি চুদি মাগির পোলা 💞 " + name,
        "বান্দির পোলা তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 💖 " + name,
        "বান্দি মাগির পোলা তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে 💘 " + name,
        "উফফফ খাদ্দামা মাগির পোলা তর আম্মুর কালা ভুদায় আমার মাল আউট 💦 " + name,
        "অনলাইনে গালি বাজ হয়ে গেছত মাগির পোলা এমন চুদা দিমু লাইফ টাইম 😏 " + name,
        "বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো 😈 " + name,
        "হাই মাদারচোদ তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি 💖 " + name,
        "~ চুদা কি আরো খাবি মাগির পোল 😏💘",
        "খাংকির পোলা 💦 " + name,
        "মাদারচোদ এত কথা বাদ চল ২ জন মিলে তর মারে ধষন করি 💖 " + name,
        "ব্যাস্যার পোলা 😈 " + name,
        "ব্যাশ্যা মাগির পোলা! তার মার কচি ভুদায় ৭০ মণ বাগুন চাষ 💦 " + name,
        "পতিতা মাগির পোলা তোর মারে শেখ হাসিনা এর জামাই নরেন্দ্র মোদি কে দিয়ে পুটকি মারি 😏 " + name,
        "depression থেকেও তর মাইরে চু*** দি 💋 " + name,
        "তর মারে চুদি আপনার মারে ভুতের গল্প সুনিয়ে আসতে আসতে শির শির ভাবে চুদতে জায় 💖 " + name,
        "নাট বল্টু মাগির পোলা তোর মারে পাকিস্তান রাজধানী লাহোর এ নিয়ে চুদবো 😈 " + name,
        "তর বোন রে পায়জামা খুলে চুদি 💦 " + name,
        "উম্মম্মা তর বোন এর কচি ভুদায় 💘 " + name,
        "DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম 💋 " + name,
        "কামলা মাগির পোলা 😏 " + name,
        "বাস্ট্রাড এর বাচ্ছা বস্তির পোলা তোর মাকে গ্রীন লাইন গাড়ির ছাদের উপর ফালিয়ে চুদবো 💖 " + name,
        "~ আমার জারজ সন্তান 💦",
        "Welcome মাগির পোলা। ভোদা জানে চোদার মজা তোর মাকে এখানেই শেষ 😈 " + name
    ];

    let delay = 0;
    const interval = 2000; // 2 seconds per message (fast)

    messages.forEach(msg => {
        setTimeout(() => { a({ body: msg, mentions: arraytag }); }, delay);
        delay += interval;
    });
}
