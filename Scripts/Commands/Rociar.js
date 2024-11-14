const Command = require("./command_cls.js")
const { EmbedBuilder } = require("discord.js");

class Rociar extends Command
{
    async execution(msg)
    {
        let reply = "";

        if (this.get_content(msg) !== "")
            reply = `**${this.get_mention(msg)}** roció a **${this.get_content(msg)}**... ¿Con qué sustancia? No lo sabemos.`
        else
            reply = `**${this.get_mention(msg)}** acabó de autorociarse... ¿Con agua? ¿Quizás tenía calor?`

        let embed = new EmbedBuilder()
            .setColor("#65a7fc")
            .setDescription(reply);

        msg.reply({embeds: [embed]})
    }
}

module.exports = new Rociar("!rociar", "accion");