const Command = require("./command_cls.js")

class Primos extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_content(msg)} tiene un ${Math.floor(Math.random() * 100) + 1}% de probabilidades de ser mi primo`);
        else
            msg.reply(`${this.get_mention(msg)}, tenes un ${Math.floor(Math.random() * 100) + 1}% de probabilidades de ser mi primo`)
    }
}

module.exports = new Primos("!primos");