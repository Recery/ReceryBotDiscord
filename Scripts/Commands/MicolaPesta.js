const Command = require("./command_cls.js")

class MicolaPesta extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: "Micola Pesta y Alberto Instantáneo, nunca supe como se escribe.",
            files: [this.get_image_directory() + "/micolapesta.jpg"]
        });
    }
}

module.exports = new MicolaPesta("!micolapesta");