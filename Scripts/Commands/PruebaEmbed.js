const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class PruebaEmbed extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("Embed de Recery Bot")
            .setURL("https://discord.com/oauth2/authorize?client_id=1295826584153882744&permissions=1689934340028480&integration_type=0&scope=bot+applications.commands")

        msg.reply({embeds: [embed]});
    }
}

module.exports = new PruebaEmbed("!pruebaembed");