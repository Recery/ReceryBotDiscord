const Command = require("./command_cls.js")
const available_commands = require(process.cwd() + "/Scripts/available_commands")

class ReceryHelp extends Command
{
    execution(msg)
    {
        var message = "Comandos de Recery Bot: \n"
        for (const command of available_commands)
        {
          message += command.get_activator() + ", ";
        }
        message = message.slice(0, -2);
        msg.reply(message);
    }
}

module.exports = new ReceryHelp("!receryhelp");