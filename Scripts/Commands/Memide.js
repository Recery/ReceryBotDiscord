const Command = require("./command_cls.js")

class Memide extends Command
{
    execution(msg)
    {
        msg.reply(`${this.get_mention(msg)}, te mide ${Math.floor(Math.random() * 30) + 1}cm`)
    }
}

module.exports = new Memide("!memide");