const DB = require("better-sqlite3");
const { description } = require("./setLang");

module.exports = {
    name: "setprefix",
    category: "administration",
    description: {
        es: "Cambia el prefijo usado para mis comandos en este servidor.",
        en: "Changes the prefix used for my commands in this server."
    },
    examples: ["{{prefix}}setprefix r!", "{{prefix}}setprefix -", "{{prefix}}setprefix abc"],
    execute(client, msg, args)
    {
        const serverID = msg.guildId;
        const lang = client.langs.get(serverID) || "es";

        if (!args.length > 0) {
            msg.reply(messages[lang].noPrefix);
            return;
        }
        else if (args[0].length > 5) {
            msg.reply(messages[lang].longPrefix);
            return;
        }

        const newPrefix = args[0];

        const db = new DB(process.env.ADMIN_DB_PATH);
        db.prepare("INSERT OR REPLACE INTO prefixes (serverId, prefix) VALUES (?, ?)").run(serverID, newPrefix);

        msg.reply(messages[lang].prefixUpdated.replace("{{prefix}}", newPrefix));

        db.close();
    }
}

const messages = {
    es: {
        noPrefix: "Debes ingresar un prefijo válido.",
        longPrefix: "El prefijo no puede tener mas de 5 caracteres.",
        prefixUpdated: "El prefijo fue cambiado a `{{prefix}}` con éxito."
    },
    en: {
        noPrefix: "You must enter a valid prefix.",
        longPrefix: "Prefix cannot have more than 5 characters.",
        prefixUpdated: "Prefix was succesfully changed to `{{prefix}}`."
    }
}