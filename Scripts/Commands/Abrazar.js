const Command = require("./command_cls.js")
const { EmbedBuilder } = require("discord.js");

class Abrazar extends Command
{
    async execution(msg)
    {
        let reply = "";

        if (this.get_content(msg) !== "")
            reply = `¡**${this.get_mention(msg)}** le dio un abrazo **${this.get_content(msg)}**!.`
        else
            reply = `**${this.get_mention(msg)}** se dio un abrazo a si mism@... ¿Cómo es eso posible?`

        let embed = new EmbedBuilder()
            .setColor("#65a7fc")
            .setDescription(reply);

        msg.reply({embeds: [embed]})
    }
}

module.exports = new Abrazar("!abrazar", "accion");