module.exports = {
    name: "8ball",
    category: "fun",
    description: {
        es: "Ingresa una pregunta de si o no, y yo te la contesto.",
        en: "Enter a yes or no question, and I will answer it.",
    },
    execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args.length > 0) {
            msg.reply(messages[lang]);
            return;
        }

        const replies = Object.values(possibleReplies[lang]);

        msg.reply(replies[Math.floor(Math.random() * replies.length)]);
    },
};

const messages = {
    es: "Ingresa una pregunta. No tengo todo el día.",
    en: "Ask me a question. I don't have all the day."
}

const possibleReplies = {
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