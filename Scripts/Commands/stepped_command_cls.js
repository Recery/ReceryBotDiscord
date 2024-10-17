const Command = require("./command_cls.js")

// Un comando que tiene más de un paso
class Stepped_Command extends Command
{
    users_activated = [];

    check_activation(msg)
    {
        if (!msg.content.startsWith(this.get_activator())) return;

        if (this.users_activated.includes(this.get_mention(msg)))
        {
            this.second_execution(msg);

            const index = this.users_activated.indexOf(this.get_mention(msg));
            if (index !== -1) this.users_activated.splice(index, 1);
        }
        else
        {
            this.execution(msg);
            this.users_activated.push(this.get_mention(msg));
        }
    }

    // La ejecucion que hace el comando luego de haber sido activado la primera vez (sobreescribir el metodo)
    second_execution(msg){}
}

module.exports = Stepped_Command;