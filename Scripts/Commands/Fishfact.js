const Command = require("./command_cls.js")

class Fishfact extends Command
{
    execution(msg)
    {
        switch(Math.floor(Math.random() * 3) + 1)
        {
            case 1: msg.reply("Las corydoras no tienen escamas, sino que tienen placas oseas que recubren su cuerpo");
              break;
            case 2: msg.reply("Los peces guppy son muy faciles de reproducir")
              break;
            case 3: msg.reply("Los peces cebrita comparten una gran parte de su ADN con el ser humano");
              break;
        }
    }
}

module.exports = new Fishfact("!fishfact");