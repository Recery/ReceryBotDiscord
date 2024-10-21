const Command = require("./command_cls.js")

class Horny extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_content(msg)} está un ${Math.floor(Math.random() * 100) + 1}% horny :hot_face:`);
        else
            msg.reply(`${this.get_mention(msg)} está un ${Math.floor(Math.random() * 100) + 1}% horny :hot_face:`);
    }
}

module.exports = new Horny("!horny");
