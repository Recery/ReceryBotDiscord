const { EmbedBuilder } = require("discord.js");
const path = require("path");
const Command = require("./command_cls.js");

class Pez extends Command
{
    peces = [
        {nombre: "Goldfish", image: this.get_image_directory() + "/Peces/Goldfish.jpg"},
        {nombre: "Betta", image: this.get_image_directory() + "/Peces/Betta.jpg"},
        {nombre: "Escalar", image: this.get_image_directory() + "/Peces/Escalar.jpg"},
        {nombre: "Cebrita", image: this.get_image_directory() + "/Peces/Cebrita.jpg"},
        {nombre: "Guppy", image: this.get_image_directory() + "/Peces/Guppy.jpg"},
        {nombre: "Corydora Paleatus", image: this.get_image_directory() + "/Peces/CoryPaleatus.jpg"}
    ];

    execution(msg)
    {
        let pez = this.peces[Math.floor(Math.random() * this.peces.length)];

        const embed = new EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(pez.nombre)
            .setImage("attachment://" + path.basename(pez.image));

        msg.reply({
            embeds: [embed],
            files: [{ attachment: pez.image, name: path.basename(pez.image) }]
        });
    }
}

module.exports = new Pez("!pez", "diversion");