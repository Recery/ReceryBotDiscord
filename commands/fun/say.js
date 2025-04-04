

module.exports = {
    name: "say",
    category: "fun",
    description: {
        es: "Enviás un mensaje, y después yo lo digo.",
        en: "You send a message, and then I say it."
    },
    syntax: {
        es: "{{prefix}}say <mensaje>",
        en: "{{prefix}}say <message>"
    },
    examples: ["{{prefix}}say hello world", "{{prefix}}say hola mundo"],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (args.length < 1) {
            msg.reply(messages[lang].emptyMessage)
            return;
        }

        for (const arg of args) {
            if (arg.includes("@everyone") || arg.includes("@here") || arg.match(/<@&\d+>/)) {
                msg.reply(messages[lang].notMention);
                return;
            }
        }

        const text = args.join(" ");

        let msgToReply;
        if (msg.reference)
            msgToReply = await msg.channel.messages.fetch(msg.reference.messageId);

        if (msgToReply)
            await msgToReply.reply({
                content: text,
                allowedMentions: { parse: [] }
            });
        else
            await msg.channel.send({
                content: text,
                allowedMentions: { parse: [] }
            });

        await msg.delete();
    }
}

const messages = {
    es: {
        emptyMessage: "No puedo decir un mensaje vacío.",
        notMention: "No puedo mencionar roles. Tampoco everyone ni here."
    },
    en: {
        emptyMessage: "I can't send an empty message.",
        notMention: "I'm not allowed to mention roles. Neither can everyone or here."
    }
}