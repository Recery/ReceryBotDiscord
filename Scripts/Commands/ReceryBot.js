const Command = require("./command_cls.js")

class ReceryBot extends Command
{
    execution(msg)
    {
        msg.reply(`Hola ${this.get_mention(msg)}, soy Recery Bot, un bot creado por SenkoSan12543. Soy argentino y me gustan los peces. Tengo una obsesión por el Terraria.`)
    }
}

module.exports = new ReceryBot("!recerybot", "ayuda");