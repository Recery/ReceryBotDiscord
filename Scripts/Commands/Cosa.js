const Command = require("./command_cls.js")

class Cosa extends Command
{
    execution(msg)
    {
        switch(Math.floor(Math.random() * 5) + 1)
        {
            case 1: msg.reply("El cosito de la pizza: <:CositoDeLaPizza:1296179027853447208>");
              break;
            case 2: msg.reply("Una piedra: <:Piedra:1296180253328408641>")
              break;
            case 3: msg.reply("Linterna: <:Linterna:1296180239826944112>");
              break;
            case 4: msg.reply("Bombucha: <:Bombucha:1296180276652937259>");
              break;
            case 5: msg.reply("Queso: <:Queso:1296180263402868766>");
              break;
        }
    }
}

module.exports = new Cosa("!cosa");