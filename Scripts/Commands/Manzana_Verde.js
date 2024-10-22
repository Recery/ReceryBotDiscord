const Command = require("./command_cls.js")
const mysql = require('mysql2/promise');

class ManzanaVerde extends Command
{
    async execution(msg)
    {
        let green_apples = await this.get_bot_state().get_green_apples(this.get_mention(msg));

        msg.reply(`${this.get_mention(msg)}, ahora tenes ${green_apples}<:ManzanaVerde:1296171434246410380>`)
    }
}

module.exports = new ManzanaVerde("!manzanaverde");