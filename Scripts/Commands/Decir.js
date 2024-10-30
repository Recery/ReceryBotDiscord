const Command = require("./command_cls.js")

class Decir extends Command
{
    execution(msg)
    {
        msg.reply(this.get_content(msg));
        msg.delete();
    }
}

module.exports = new Decir("!decir");