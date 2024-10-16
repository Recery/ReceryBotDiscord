const Command = require("./command_cls.js")

class Pez extends Command
{
    execution(msg)
    {
        msg.reply(
            {
                content: "Un pez",
                files: ["../../Images/goldfish.jpg"]
            }
        );
    }
}

module.exports = new Pez("!pez");