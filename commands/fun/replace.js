

module.exports = {
    name: "replace",
    category: "fun",
    description: {
        es: "Envías un mensaje, el contenido a reemplazar, y el contenido a agregar en el reemplazo.\n" +
        "Reemplazaré todas las ocurrencias del contenido a reemplazar por el reemplazo a agregar.",
        en: "You send a message, the content to replace, and the content to add in the replacement.\n" +
        "I will replace all the occurrences of the content to replace for the replacement to add."
    },
    examples: ["{{prefix}}replace hello goodbye hellogoodbye", "{{prefix}}replace no yes nonono"],
    syntax: {
        es: "{{prefix}}replace <contenido a reemplazar> <contenido a añadir> <mensaje>",
        en: "{{prefix}}replace <content to replace> <content to add> <message>"
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        if (!(args[0] && args[1] && args[2])) {
            msg.reply(messages[lang].noContent);
            return;
        }

        const [toReplace, toAdd] = [args[0], args[1]];

        if (toAdd.includes("@everyone") || toAdd.includes("@here") || toAdd.match(/<@&\d+>/)) {
            msg.reply(messages[lang].notMention);
            return;
        }

        let text = "";
        for (let i = 0; i < args.length; i++) {
            if (i === 0 || i === 1) continue;
            text += args[i] + " ";
        }
        text.trim();

        if (text.includes("@everyone") || text.includes("@here") || text.match(/<@&\d+>/)) {
            msg.reply(messages[lang].notMention);
            return;
        }
        
        const newtext = text.replaceAll(toReplace, toAdd);

        msg.reply({
            content: newtext,
            allowedMentions: { parse: [] }
        });
    }
}

const messages = {
    es: {
        notMention: "No puedo mencionar roles. Tampoco everyone ni here.",
        noContent: "Debes ingresar el contenido que será reemplazado, el contenido que se añadirá en el reemplazo, y el mensaje con el contenido."
    },
    en: {
        notMention: "I'm not allowed to mention roles. Neither can everyone or here.",
        noContent: "You must enter the content to be replaced, the content that will be added in the replacemente, and the message with the content."
    }
}