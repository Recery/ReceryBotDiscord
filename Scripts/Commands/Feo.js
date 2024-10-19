const Command = require("./command_cls.js")

class Feo extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_content(msg)} es un ${Math.floor(Math.random() * 100) + 1}% feo`);
        else
            msg.reply(`${this.get_mention(msg)}, sos un ${Math.floor(Math.random() * 100) + 1}% feo`);
    }
}

module.exports = new Feo("!feo");