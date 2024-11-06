const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class ReceryInvite extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#aa54eb")
            .setTitle("¡Click aquí para invitarme a tu servidor!")
            .setURL("https://discord.com/oauth2/authorize?client_id=1295826584153882744&permissions=1689934340028480&integration_type=0&scope=bot+applications.commands")
            .setDescription("¿Querés invitarme a tu servidor? ¡Hace click en el link de arriba!")
            .setImage("attachment://ReceryBot.png");

        msg.reply({
            embeds: [embed],
            files: [{ attachment: this.get_image_directory() + "/ReceryBot.png", name: "ReceryBot.png" }]
        });
    }
}

module.exports = new ReceryInvite("!receryinvite");
