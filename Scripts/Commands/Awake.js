const Command = require("./command_cls.js")

class Awake extends Command
{
    execution(msg)
    {
        if (!this.get_activator().get_asleep())
            msg.reply("Ya estoy despierto, no ves que tengo los ojos abiertos?")
        else
        {
            this.get_activator().set_asleep(false);
            msg.reply("La puta madre para que me despertas... Terrible siesta me estaba haciendo");
        }
    }
}

module.exports = new Awake("!senkoawake");