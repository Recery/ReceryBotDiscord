const Command = require("./command_cls.js")

class Kofi extends Command
{
    execution(msg)
    {
        msg.reply(`¿Te interesa donar dinero a mi creador, ${this.get_mention(msg)}? Entra en este link: https://ko-fi.com/recery`)
    }
}

module.exports = new Kofi("!senkofi");