const Command = require("./command_cls.js")

class PruebaBoton extends Command
{
    execution(msg)
    {
        const button = new ButtonBuilder()
            .setCustomId('boton_click')
            .setLabel('Apretar boton')
            .setStyle(ButtonStyle.Primary);

        msg.reply(
        {
            content: "Este es un boton de prueba",
            components: [button]
        });
    }
}

module.exports = new PruebaBoton("!pruebaboton");