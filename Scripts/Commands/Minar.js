const Command = require("./command_cls.js")

class Minar extends Command
{
    execution(msg)
    {
        msg.reply("!hi");
    }
}

module.exports = new Minar("!minar");
