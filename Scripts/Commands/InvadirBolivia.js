const Command = require("./command_cls.js")

class InvadirBolivia extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: "Comenzó la operación invadir Bolivia, preparen sus barcos para atravesar los mares bolivianos",
            files: [this.get_gifs_directory() + "/barco.gif"]
        });
    }
}

module.exports = new InvadirBolivia("!invadirbolivia");