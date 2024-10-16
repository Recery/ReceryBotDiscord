const Command = require("./command_cls.js")

class Sumiso extends Command
{
    execution(msg)
    {
        msg.reply(`${this.get_mention(msg)} es un ${Math.floor(Math.random() * 100) + 1}% sumis@`)
    }
}

module.exports = new Sumiso("!sumiso");