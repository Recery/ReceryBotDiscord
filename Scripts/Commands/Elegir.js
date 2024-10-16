const Command = require("./command_cls.js")

class Elegir extends Command
{
    execution(msg)
    {
        var opciones = msg.content.split(",");
        var elegido = opciones[Math.floor(Math.random() * opciones.length)];
        msg.reply("Elegí " + elegido + " por vos. La próxima no seas pajero y elegí una opción por tu cuenta.");
    }
}

module.exports = new Elegir("!elegir");