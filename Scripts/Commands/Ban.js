const Command = require("./command_cls.js")

class Ban extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_mention(msg)} acabó de banear a ${this.get_content(msg)} XD`);
        else
            msg.reply(`${this.get_mention(msg)} se acabó de autobanear... ¿Por qué haría eso? Alt@ bolud@.`)
    }
}

module.exports = new Ban("!ban", "accion");