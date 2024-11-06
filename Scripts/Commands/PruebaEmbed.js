const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class PruebaEmbed extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("Embed de Recery Bot");

        msg.reply({embeds: [embed]});
    }
}

module.exports = new PruebaEmbed("!pruebaembed");