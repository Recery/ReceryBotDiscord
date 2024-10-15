const command = require("commands_cls.js")

class Saludar extends command
{
    execution(msg)
    {
        msg.reply(`Saludos ${get_mention(msg)} pedazo de pelotudo`)
    }
}

module.exports = new Saludar("!saludar");