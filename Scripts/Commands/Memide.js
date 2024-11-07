const Command = require("./command_cls.js")

class Memide extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`A ${this.get_content(msg)} le mide ${Math.floor(Math.random() * 30) + 1}cm`);
        else
            msg.reply(`${this.get_mention(msg)}, te mide ${Math.floor(Math.random() * 30) + 1}cm`)
    }
}

module.exports = new Memide("!memide", "diversion");