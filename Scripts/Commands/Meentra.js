const Command = require("./command_cls.js")

class Meentra extends Command
{
    execution(msg)
    {
        if (Math.floor(Math.random() * 2) + 1  === 1)
            msg.reply(`${this.get_mention(msg)}, es grande... No te entra`);
        else
            msg.reply(`${this.get_mention(msg)}, es muy chiquito, seguro te entra`);
    }
}

module.exports = new Meentra("!meentra");