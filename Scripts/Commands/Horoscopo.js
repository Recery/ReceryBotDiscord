const Command = require("./command_cls.js")

class Horoscopo extends Command
{
    execution(msg)
    {
        var opciones = [
            "Tendrás un gran día hoy, con muchas posibilidades de conseguir dinero :money_mouth:",
            "Creo que no será un gran día... Mejor cuidate.",
            "Mañana tendrás una gran sorpresa.",
            "El año que viene será mucho mejor que este.",
            "Tu futuro es incierto... Todo depende de ti.",
            "No te des por vencid@, sigue luchando por lo que deseas. Lo vas a conseguir.",
            "Ni se te ocurra salir de tu casa... La desgracia te persigue hoy.",
            "Recibirás una noticia dentro de poco... ¿Buena o mala? Quien sabe."
        ]

        msg.reply("||No creo en estas mierdas, pero allá vamos...|| \n" + opciones[Math.floor(Math.random() * opciones.length)]);
    }
}

module.exports = new Horoscopo("!horoscopo");