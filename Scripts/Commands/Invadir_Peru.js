const Command = require("./command_cls.js")

class Invadir_Peru extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: "Comenzó la operación invadir Perú, preparen sus armas",
            files: [this.get_gifs_directory() + "/Armas.gif"]
        });
    }
}

module.exports = new Invadir_Peru("!invadirperu");