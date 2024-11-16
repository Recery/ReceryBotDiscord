const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class Kofi extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#ffffff")
            .setTitle("¡Click aquí para ir al Ko-fi de Recery!")
            .setURL("https://ko-fi.com/recery")
            .setDescription(`${this.get_mention(msg)}, ¿Querés donarle a mi creador? ¡Hace click en el link de arriba! \n **(Por favor ayudame a seguir con vida, estoy por morirme :sob:)**`)
            .setImage("attachment://Recery.png");

        msg.reply({
            embeds: [embed],
            files: [{ attachment: this.get_image_directory() + "/Recery.png", name: "Recery.png" }]
        });
    }
}

module.exports = new Kofi("!recerykofi", "apoyo");