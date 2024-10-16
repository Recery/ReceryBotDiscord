const Command = require("./command_cls.js")

class Invadir_Peru extends Command
{
    execution(msg)
    {
        msg.reply("Comenzó la operación invadir Perú, preparen sus armas")
    }
}

module.exports = new Invadir_Peru("!ping");