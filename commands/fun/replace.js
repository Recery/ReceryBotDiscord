

module.exports = {
    name: "replace",
    category: "fun",
    description: {
        es: "Envías un mensaje, el contenido a reemplazar, y el contenido a agregar en el reemplazo.\n" +
        "Reemplazaré todas las ocurrencias del contenido a reemplazar por el reemplazo a agregar.",
        en: "You send a message, the content to replace, and the content to add in the replacement.\n" +
        "I will replace all the occurrences of the content to replace for the replacement to add."
    },
    examples: ["{{prefix}}replace hello goodbye hellogoodbye", "{{prefix}}replace yes no nonononono"],
    syntax: {
        es: "{{prefix}}replace <contenido a reemplazar> <contenido a añadir> <mensaje>",
        en: "{{prefix}}replace <content to replace> <content to add> <message>"
    },
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!(args[0] && args[1] && args[2])) {
            msg.reply(messages[lang]);
            return;
        }

        const [toReplace, toAdd] = [args[0], args[1]];
        let text = "";
        for (let i = 0; i < args.length; i++) {
            if (i === 0 || i === 1) continue;
            text += args[i] + " ";
        }
        text.trim();
        
        const newtext = text.replaceAll(toReplace, toAdd);

        msg.reply(newtext);
    }
}

const messages = {
    es: "Debes ingresar el contenido que será reemplazado, el contenido que se añadirá en el reemplazo, y el mensaje con el contenido.",
    en: "You must enter the content to be replaced, the content that will be added in the replacemente, and the message with the content."
}