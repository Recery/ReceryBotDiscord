const Command = require("./command_cls.js")

class Ping extends Command
{
    execution(msg)
    {
        msg.reply("pong... Mi creador es un pelotudo y no sabe como mostrar mi ping, conformate con eso XD");
    }
}

module.exports = new Ping("!ping");