const Command = require("./command_cls.js");

class BanAgua extends Command
{
    constructor(init_activator, init_categoria)
    {
        super(init_activator, init_categoria);
    }

    async execution(msg)
    {
        await this.add_ban();
        var bans = await this.get_bans();
        msg.reply(`${this.get_mention(msg)} acabó de banear a Agua. Agua ya fue baneado ${bans} veces XD`);
    }

    async connect_database()
    {
        const conex = await mysql.createConnection({
            uri: process.env.db,
            ssl: {rejectUnauthorized: false}
        });

        const [rows] = await conex.execute('SELECT COUNT(*) AS count FROM bansagua');
        if (rows[0].count === 0)
            await conex.execute('INSERT INTO bansagua (bans) VALUES (?)', [0]);

        return conex;
    }

    async add_ban()
    {
        const conex = await this.connect_database();
        
        await conex.execute('UPDATE bansagua SET bans = bans + 1 WHERE id = 1');

        await conex.end();
    }

    async get_bans()
    {
        const conex = await this.connect_database();
        const [rows] = await conex.execute('SELECT bans FROM bansagua WHERE id = 1');

        if (rows.length > 0)
        {
            const bans = rows[0].bans;
            await conex.end();
            return bans;
        }

        await conex.end();
        return 0;
    }
}

module.exports = new BanAgua("!banagua", "accion");