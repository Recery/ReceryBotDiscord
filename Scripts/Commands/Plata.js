const Command = require("./command_cls.js")

class Plata extends Command
{
    execution(msg)
    {
        msg.react(":money_with_wings:");
    }
}

module.exports = new Plata("!plata");
