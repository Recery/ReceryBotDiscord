const Command = require("./command_cls.js")
const { ButtonBuilder, ButtonStyle } = require('discord.js');

class PruebaBoton extends Command
{
    execution(msg)
    {
        const button = new ButtonBuilder()
            .setCustomId('boton_click')
            .setLabel('Apretar boton')
            .setStyle(1)
            .setType(1);

        msg.reply(
        {
            content: "Este es un boton de prueba",
            components: [button]
        });
    }
}

module.exports = new PruebaBoton("!pruebaboton");