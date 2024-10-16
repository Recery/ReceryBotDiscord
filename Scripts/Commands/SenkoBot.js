const Command = require("./command_cls.js")

class SenkoBot extends Command
{
    execution(msg)
    {
        msg.reply(`Hola ${get_mention(msg)}, soy Senko Bot, un bot creado por SenkoSan12543. Soy argentino y me gustan los peces. Tengo una obsesión por el Terraria.`)
    }
}

module.exports = new SenkoBot("!senkobot");