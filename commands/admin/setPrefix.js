const DB = require("better-sqlite3");

module.exports = {
    name: "setprefix",
    category: "administration",
    execute(client, msg, args)
    {
        const serverid = msg.guildId;
        const lang = client.langs.get(serverid) || "es";

        if (!args.length > 0) 
        {
            msg.reply(messages[lang].no_prefix);
            return;
        }
        else if (args[0].length > 5)
        {
            msg.reply(messages[lang].long_prefix);
            return;
        }

        const new_prefix = args[0];

        const db = new DB(process.env.ADMIN_DB_PATH);
        const row = db.prepare("SELECT id FROM prefixes WHERE serverid = ?").get(serverid);

        if (row)
            db.prepare("UPDATE prefixes SET prefix = ? WHERE id = ?").run(new_prefix, row.id)
        else
            db.prepare("INSERT INTO prefixes (serverid, prefix) VALUES (?, ?)").run(serverid, new_prefix);

        msg.reply(messages[lang].prefix_updated.replace("{{prefix}}", new_prefix));
    }
}

const messages = {
    es: {
        no_prefix: "Debes ingresar un prefijo válido.",
        long_prefix: "El prefijo no puede tener mas de 5 caracteres.",
        prefix_updated: "El prefijo fue cambiado a `{{prefix}}` con éxito."
    },
    en: {
        no_prefix: "You must enter a valid prefix.",
        long_prefix: "Prefix cannot have more than 5 characters.",
        prefix_updated: "Prefix was succesfully changed to `{{prefix}}`."
    }
}