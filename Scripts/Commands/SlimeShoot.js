const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js")

class SlimeShoot extends Command
{
    execution(msg)
    {
        const embed = new EmbedBuilder()
            .setColor("#00db3a")
            .setTitle("¡Click aquí para instalar Slime Shoot!")
            .setURL("https://recery.itch.io/slime-shoot")
            .setDescription("Mi creador, además de crearme a mí, también creó un juego muy interesante... \n Lo podés descargar gratis haciendo click en el link de arriba.")
            .setImage("attachment://SlimeShoot.png");

        msg.reply({
            embeds: [embed],
            files: [{ attachment: this.get_image_directory() + "/SlimeShoot.png", name: "SlimeShoot.png" }]
        });
    }
}

module.exports = new SlimeShoot("!slimeshoot");