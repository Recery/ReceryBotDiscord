const DB = require("better-sqlite3");

module.exports = {
    name: "setprefix",
    execute(msg, args)
    {
        console.log(args, " desde el comando")
        if (!args) 
        {
            msg.reply("Debes ingresar un prefijo válido.");
            return;
        }
        else if (args[0].length > 5)
        {
            msg.reply("El prefijo no puede tener mas de 5 caracteres.");
            return;
        }

        const serverid = msg.guildId;
        const new_prefix = args[0];

        const db = new DB(process.env.ADMIN_DB_PATH);
        const row = db.prepare("SELECT id FROM prefixes WHERE serverid = ?").get(serverid);

        if (row)
            db.prepare("UPDATE prefixes SET prefix = ? WHERE id = ?").run(new_prefix, row.id)
        else
            db.prepare("INSERT INTO prefixes (serverid, prefix) VALUES (?, ?)").run(serverid, new_prefix);

        msg.reply("El prefijo fue cambiado a `" + new_prefix + "` con éxito.");
    }
}