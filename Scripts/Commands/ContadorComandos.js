const Command = require("./command_cls.js")

class ContadorComandos extends Command
{
    async execution(msg)
    {
        let commands_used = await this.get_commands_used(msg);
        msg.reply(`${this.get_mention(msg)}, usaste un total de ${commands_used} comandos.`);
    }
}

module.exports = new ContadorComandos("!contadorcomandos");
