const Command = require("./command_cls.js")

class Fart extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_content(msg)} se tiró tremendo fart... ¡Que olor a mierda que hay!`);
        else
            msg.reply(`${this.get_mention(msg)} se tiró tremendo fart... ¡Que olor a mierda que hay!`)
    }
}

module.exports = new Fart("!fart", "accion");