const Command = require("./command_cls.js")

class Pelotudo extends Command
{
    execution(msg)
    {
        msg.reply("Callate enfermo, el pelotudo sos vos");
    }
}

module.exports = new Pelotudo("!pelotudo");