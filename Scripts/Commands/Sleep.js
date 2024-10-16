const Command = require("./command_cls.js")

class Sleep extends Command
{
    check_activation(msg)
    {
      if (msg.content.startsWith(this.activator))
        this.execution(msg);
    }

    execution(msg)
    {
        if (this.get_bot_state().get_asleep())
            msg.reply("Zzz... (Ya estoy dormido pelotudo)");
        else
        {
            this.get_bot_state().set_asleep(true);
            msg.reply("Vamos carajo, ya me estaba cansando de vos... A dormir... Zzz");
        }
    }
}

module.exports = new Sleep("!senkosleep");