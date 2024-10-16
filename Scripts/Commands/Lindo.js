const Command = require("./command_cls.js")

class Lindo extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: "No soy lindo, no digas pelotudeces.",
            files: [this.get_gifs_directory() + "/Puchero1.gif"]
        });
    }
}

module.exports = new Lindo("!lindo");
