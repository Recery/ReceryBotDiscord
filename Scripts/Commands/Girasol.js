const Command = require("./command_cls.js")

class Girasol extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: "Plantaste un productor solar... Imagino que al frente, como corresponde",
            files: [this.get_gifs_directory() + "/Girasol.gif"]
        });
    }
}

module.exports = new Girasol("!girasol", "diversion");