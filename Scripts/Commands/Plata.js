const Command = require("./command_cls.js")

class Plata extends Command
{
    execution(msg)
    {
        msg.react("💸");
        msg.react("🤑");
        msg.react("<:ManzanaVerde:1296171434246410380>")
    }
}

module.exports = new Plata("!plata");
