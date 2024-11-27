const Command = require("./command_cls.js")

class Embarazar extends Command
{
    async execution(msg)
    {
        let reply = "";

        if (this.get_content(msg) !== "")
            reply = `¡**${this.get_mention(msg)}** acabó de embarazar a **${this.get_content(msg)} XD**!`
        else
            reply = `**${this.get_mention(msg)}** se acabó de embarazar a si mismo... ¿Reproducción asexual?`

        msg.reply(reply);
    }
}

module.exports = new Embarazar("!embarazar", "accion");