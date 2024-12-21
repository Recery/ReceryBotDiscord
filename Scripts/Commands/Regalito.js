const Command = require("./command_cls.js")

class Regalito extends Command
{
    execution(msg)
    {
        if (msg.author.id !== "1296846133489963049" && msg.author.id !== "1069155273182285834") 
        {
            msg.reply("Usuario no autorizado.");
            return;
        }

        msg.reply(`Saludos ${this.get_mention(msg)} pedazo de pelotudo`)
    }
}

module.exports = new Regalito("!regalito", "diversion");