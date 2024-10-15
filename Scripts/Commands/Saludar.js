const Command = require("./command_cls.js")

class Saludar extends Command
{
    execution(msg)
    {
        msg.reply(`Saludos ${get_mention(msg)} pedazo de pelotudo`)
    }
}

module.exports = new Saludar("!saludar");