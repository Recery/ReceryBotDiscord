const Command = require("./command_cls.js")
const mysql = require('mysql2/promise');

class ManzanaVerde extends Command
{
    async execution(msg)
    {
        let green_apples = await this.add_green_apple(this.get_mention(msg));

        msg.reply(`${this.get_mention(msg)}, ahora tenes ${green_apples}<:ManzanaVerde:1296171434246410380>`)
    }

    async connect_database()
    {
        const conex = await mysql.createConnection({
            uri: process.env.db,
            ssl: {rejectUnauthorized: false}
        });

        return conex;
    }

    async add_green_apple(mention)
    {
        const conex = await this.connect_database();

        const [rows] = await conex.execute('SELECT * FROM users_green_apples');

        let add_row = true;
        let id = null;
        let green_apples = 1;

        for (const row of rows)
        {
            if (mention === row.mention)
            {
                id = row.id;
                await conex.execute('UPDATE users_green_apples SET green_apples = green_apples + 1 WHERE id = ?', [id]);
                
                const [updated_row] = await conex.execute('SELECT green_apples FROM users_green_apples WHERE id = ?', [id]);
                green_apples = updated_row[0].green_apples;

                add_row = false;
                break;
            }
        }

        if (add_row)
        {
            await conex.execute('INSERT INTO users_green_apples (mention, green_apples) VALUES (?, ?)', [mention, green_apples]);
        }

        await conex.end();

        return green_apples;
    }
}

module.exports = new ManzanaVerde("!manzanaverde");