

module.exports = {
    name: "replace",
    category: "fun",
    description: {
        es: "Envías un mensaje.",
        en: "You send a message, and then I say it."
    },
    examples: ["{{prefix}}say hello world", "{{prefix}}say hola mundo"],
    async execute(client, msg, args) {
        if (!(args[0] && args[1] && args[2])) {
            msg.reply("Debes ingresar el contenido que será reemplazado, el contenido que se añadirá en el reemplazo, y el mensaje con el contenido.");
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