const Command = require("./command_cls.js");
const Database = require('better-sqlite3');

class BanAgua extends Command
{
    constructor(init_activator)
    {
        super(init_activator);
        this.db = new Database("bansagua.db");
        this.create_database();
    }

    execution(msg)
    {
        this.add_ban();
        msg.reply(`${this.get_mention(msg)} acabó de banear a Agua. Agua ya fue baneado ${this.get_bans()} veces XD`);
    }

    create_database()
    {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS bans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bans INTEGER
            )`
        ).run();

        const row = this.db.prepare('SELECT bans FROM bans WHERE id = 1').get();
        if (!row) 
        {
            this.db.prepare('INSERT INTO bans (bans) VALUES (?)').run(0);
        }
    }

    add_ban()
    {
        this.db.prepare('UPDATE bans SET bans = bans + 1 WHERE id = 1').run();
    }

    get_bans()
    {
        const row = this.db.prepare('SELECT bans FROM bans WHERE id = 1').get();

        if (row) return row.bans;
        else return 0;
    }
}

module.exports = new BanAgua("!banagua");