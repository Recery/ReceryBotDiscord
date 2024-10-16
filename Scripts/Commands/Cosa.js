const Command = require("./command_cls.js")

class Cosa extends Command
{
    execution(msg)
    {
        switch(Math.floor(Math.random() * 8) + 1)
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
            case 6: msg.reply("Sombrero de bruja: <:SombreroBruja:1296182177523830864>");
              break;
            case 7: msg.reply("Regadera: <:Regadera:1296182197362884679>");
              break;
            case 8: msg.reply("Una guadaña: <:Guadana:1296182186382327898>");
              break;
        }
    }
}

module.exports = new Cosa("!cosa");