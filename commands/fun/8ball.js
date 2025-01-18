module.exports = {
    name: "8ball",
    category: "fun",
    execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        const replies = Object.values(messages[lang]);

        msg.reply(replies[Math.floor(Math.random() * replies.length)]);
    },
};

const messages = {
    es: {
        reply1: "Obviamente que sí.",
        reply2: "Eso jamás.",
        reply3: "A ver, decímelo de nuevo.",
        reply4: "Mmm... Creo que no.",
        reply5: "Preguntale a mi creador, no me molestes."
    },
    en: {
        reply1: "Yes, obviously.",
        reply2: "Never.",
        reply3: "Can you repeat please?",
        reply4: "Hmm... I think no.",
        reply5: "Ask my creator, don't annoy me."
    }
}