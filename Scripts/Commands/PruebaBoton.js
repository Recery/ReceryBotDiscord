/*const Command = require("./command_cls.js")
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

class PruebaBoton extends Command
{
    execution(msg)
    {
        const newButtonZones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('boton_click')
                .setLabel('Apretar boton')
                .setStyle(1)
        );

        msg.reply(
        {
            content: "Este es un boton de prueba",
            components: [newButtonZones]
        });
    }
}

module.exports = new PruebaBoton("!pruebaboton");*/