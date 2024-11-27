const Command = require("./command_cls.js")

class Decir extends Command
{
    async execution(msg)
    {
        await msg.reply(this.get_content(msg));
        await msg.delete();
    }
}

module.exports = new Decir("!decir", "diversion");