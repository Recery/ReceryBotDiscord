const Command = require("./command_cls.js")

class Plata extends Command
{
    execution(msg)
    {
        msg.react("💸");
        msg.react("🤑");
    }
}

module.exports = new Plata("!plata");
