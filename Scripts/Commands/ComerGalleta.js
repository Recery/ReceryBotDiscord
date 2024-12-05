const Command = require("./command_cls.js")

class Comer_Galleta extends Command
{
    execution(msg)
    {
        msg.reply(
            {
                content: "> Te comiste una galleta... Y es gratis, no como las de Nekotina",
                files: [this.get_gifs_directory() + "/Galleta1.gif"]
            }
        );
    }
}

module.exports = new Comer_Galleta("!comergalleta", "accion");