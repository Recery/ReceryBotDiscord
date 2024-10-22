const Command = require("./command_cls.js")

class Consejo extends Command
{
    consejos = [
        "Con !contadorcomandos puedes ver cuantas veces usaste comandos.",
        "Se dice que hay un item muy raro conocido como 'Escama de Recery'...",
        "El comando !cosa puede usarse todas las veces que quieras y sin ningún costo. ¡Manzanas verdes gratis! <:ManzanaVerde:1296171434246410380>",
        "Deberías revisar los comandos !recerykofi y !slimeshoot...",
        "¡Usa !receryhelp para ver todos mis comandos! Aunque supongo que ya sabes eso..."
    ]

    execution(msg)
    {
        msg.reply(this.consejos[Math.floor(Math.random() * this.consejos.length)]);
    }
}

module.exports = new Consejo("!consejo");