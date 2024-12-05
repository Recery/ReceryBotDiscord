const DB = require("better-sqlite3");
const Command = require("./command_cls.js");

class SetPrefix extends Command
{
    execution(msg)
    {
        const serverid = msg.guildId;
        const new_prefix = this.get_content(msg);
        
        const db = new DB(process.env.ADMIN_DB_PATH);

        // Si no existe un registro, esto no devuelve nada
        const row = db.prepare("SELECT id FROM prefixes WHERE serverid = ?").get(serverid);

        if (row)
            db.prepare("UPDATE prefixes SET prefix = ? WHERE id = ?").run(new_prefix, row.id);
        else
            db.prepare("INSERT INTO prefixes (serverid, prefix) VALUES (?, ?)").run(serverid, new_prefix);

        msg.reply(`El prefijo fue establecido a '${new_prefix}' exitosamente.`);

        db.close();
    }
}

module.exports = new SetPrefix("!setprefix");