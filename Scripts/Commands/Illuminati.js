const Command = require("./command_cls.js")

class Illuminati extends Command
{
    execution(msg)
    {
        msg.reply(":TheIlluminati: :TheIlluminati: :TheIlluminati: :TheIlluminati: :TheIlluminati:");
    }
}

module.exports = new Illuminati("!illuminati");
