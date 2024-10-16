const Command = require("./command_cls.js")

class Femboy extends Command
{
    execution(msg)
    {
        msg.reply(`${this.get_mention(msg)} es un ${Math.floor(Math.random() * 100) + 1}% femboy`)
    }
}

module.exports = new Femboy("!femboy");