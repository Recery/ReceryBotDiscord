const Command = require("./command_cls.js")

class ManzanaVerde extends Command
{
    execution(msg)
    {
        msg.reply(`LA PUTA MADRE ${this.get_mention(msg)}, MANZANA VERDE <:ManzanaVerde:1296171434246410380>, MI COMIDA FAVORITA`)
    }
}

module.exports = new ManzanaVerde("!manzanaverde");