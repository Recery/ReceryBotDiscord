const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class Zahira extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle("Te queremos mucho Zahira :heart:")
            .setImage("attachment://PetpetZahira.gif");

        msg.reply({
            embeds: [embed],
            files: [{ attachment: this.get_image_directory() + "/PetpetZahira.gif", name: "PetpetZahira.gif" }]
        });
    }
}

module.exports = new Zahira("!zahira");