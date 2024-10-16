const Command = require("./command_cls.js")

class Zahira extends Command
{
    execution(msg)
    {
        msg.reply("Te queremos mucho Zahira :heart:");
    }
}

module.exports = new Zahira("!zahira");