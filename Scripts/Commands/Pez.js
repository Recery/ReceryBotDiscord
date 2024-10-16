const Command = require("./command_cls.js")

class Pez extends Command
{
    execution(msg)
    {
        msg.reply(
            {
                content: "Un pez",
                files: [this.get_image_directory() + "/goldfish.jpg"]
            }
        );
    }
}

module.exports = new Pez("!pez");