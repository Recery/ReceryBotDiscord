const Command = require("./command_cls.js")

class Awake extends Command
{
    check_activation(msg)
    {
      if (msg.content.startsWith(this.activator))
        this.execution(msg);
    }

    execution(msg)
    {
        if (!this.get_bot_state().get_asleep())
            msg.reply("Ya estoy despierto, no ves que tengo los ojos abiertos?")
        else
        {
            this.get_bot_state().set_asleep(false);
            msg.reply("La puta madre para que me despertas... Terrible siesta me estaba haciendo");
        }
    }
}

module.exports = new Awake("!receryawake");