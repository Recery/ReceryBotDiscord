const Command = require("./command_cls.js")

class Amongus extends Command
{
    execution(msg)
    {
        msg.reply(
            {
                content: "sus",
                files: [this.get_gifs_directory() + "/amongus.gif"]
            }
        );
    }
}

module.exports = new Amongus("!amongus");