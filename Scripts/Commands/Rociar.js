const Command = require("./command_cls.js")

class Rociar extends Command
{
    async execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${await this.get_username(msg.author.id)} roció a ${await this.get_username(this.get_content(msg))}... ¿Con qué sustancia? No lo sabemos.`);
        else
            msg.reply(`${await this.get_username(msg.author.id)} acabó de autorociarse... ¿Con agua? ¿Quizás tenía calor?`)
    }
}

module.exports = new Rociar("!rociar", "accion");