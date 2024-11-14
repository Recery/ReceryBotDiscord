const Command = require("./command_cls.js")

class Rociar extends Command
{
    execution(msg)
    {
        if (this.get_content(msg) !== "")
            msg.reply(`${this.get_mention(msg)} roció a ${this.get_content(msg)}... ¿Con qué sustancia? No lo sabemos.`);
        else
            msg.reply(`${this.get_mention(msg)} acabó de autorociarse... ¿Con agua? ¿Quizás tenía calor?`)
    }
}

module.exports = new Rociar("!rociar", "accion");