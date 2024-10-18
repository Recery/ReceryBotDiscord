const Command = require("./command_cls.js")

class PruebaBoton extends Command
{
    execution(msg)
    {
        const button = new MessageButton()
            .setCustomId('primary')
            .setLabel('Primary')
            .setStyle('PRIMARY')
            .setEmoji('123456789012345678');
    
        msg.reply(
        {
            content: "Este es un boton de prueba",
            components: [button]
        });
    }
}

module.exports = new PruebaBoton("!pruebaboton");