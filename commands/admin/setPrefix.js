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
        const serverid = msg.guildId;
        const lang = client.langs.get(serverid) || "es";

        if (!args.length > 0) 
        {
            msg.reply(messages[lang].noPrefix);
            return;
        }
        else if (args[0].length > 5)
        {
            msg.reply(messages[lang].longPrefix);
            return;
        }

        const newPrefix = args[0];

        const db = new DB(process.env.ADMIN_DB_PATH);
        const row = db.prepare("SELECT id FROM prefixes WHERE serverid = ?").get(serverid);

        if (row)
            db.prepare("UPDATE prefixes SET prefix = ? WHERE id = ?").run(newPrefix, row.id)
        else
            db.prepare("INSERT INTO prefixes (serverid, prefix) VALUES (?, ?)").run(serverid, newPrefix);

        msg.reply(messages[lang].prefixUpdated.replace("{{prefix}}", newPrefix));
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