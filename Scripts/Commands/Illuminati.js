const Command = require("./command_cls.js")

class Illuminati extends Command
{
    execution(msg)
    {
        msg.reply("<:TheIlluminati:1295995086051606529><:TheIlluminati:1295995086051606529><:TheIlluminati:1295995086051606529><:TheIlluminati:1295995086051606529><:TheIlluminati:1295995086051606529>");
    }
}

module.exports = new Illuminati("!illuminati");
