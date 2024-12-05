const DB = require("better-sqlite3");
const Command = require("./command_cls.js");

class SetPrefix extends Command
{
    execution(msg)
    {
        const serverid = msg.guildId;
        const new_prefix = this.get_content(msg);
        
        const db = new DB(process.env.ADMIN_DB_PATH);

        const rows = db.prepare("SELECT * FROM prefixes").all();
        let add_row = true;

        for (const row of rows)
            if (row.serverid === serverid)
            {
                add_row = false;
                db.prepare("UPDATE prefixes SET prefix = ? WHERE id = ?").run(new_prefix, row.id);
            }

        if (add_row) db.prepare("INSERT INTO prefixes (serverid, prefix) VALUES (?, ?)").run(serverid, new_prefix);

        msg.reply(`El prefijo fue establecido a '${new_prefix}' exitosamente.`);
    }
}

module.exports = new SetPrefix("!setprefix");