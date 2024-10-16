const Command = require("./command_cls.js")

class Terraria extends Command
{
    execution(msg)
    {
        msg.reply("Indiscutiblemente el mejor juego de la historia.");
    }
}

module.exports = new Terraria("!terraria");