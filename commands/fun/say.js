

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
        const text = args.join(" ");

        let msgToReply;
        if (msg.reference)
            msgToReply = await msg.channel.messages.fetch(msg.reference.messageId);

        if (msgToReply)
            await msgToReply.reply(text);
        else
            await msg.channel.send(text);

        await msg.delete();
    }
}