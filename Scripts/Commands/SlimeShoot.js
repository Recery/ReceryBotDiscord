const Command = require("./command_cls.js")

class SlimeShoot extends Command
{
    execution(msg)
    {
        msg.reply("> Mi creador, además de crearme a mí, también creó un juego muy interesante... \n Lo podés descargar gratis acá: https://recery.itch.io/slime-shoot")
    }
}

module.exports = new SlimeShoot("!slimeshoot");