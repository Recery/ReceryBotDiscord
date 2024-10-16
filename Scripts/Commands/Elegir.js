const Command = require("./command_cls.js")

class Elegir extends Command
{
    execution(msg)
    {
        var content = msg.content.replace("!elegir", "")
        var opciones = content.split(",");
        var elegido = opciones[Math.floor(Math.random() * opciones.length)];

        msg.reply("Elegí " + elegido.trim() + " por vos. La próxima no seas pajero y elegí una opción por tu cuenta.");
    }
}

module.exports = new Elegir("!elegir");