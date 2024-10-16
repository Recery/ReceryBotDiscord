const Command = require("./command_cls.js")

class Bola8 extends Command
{
    execution(msg)
    {
        switch(Math.floor(Math.random() * 9) + 1)
        {
            case 1: msg.reply(":8ball: No sé");
              break;
            case 2: msg.reply(":8ball: Obvio que sí");
              break;
            case 3: msg.reply(":8ball: Puede ser");
              break;
            case 4: msg.reply(":8ball: Imposible");
              break;
            case 5: msg.reply(":8ball: No me rompas los huevos, preguntale a mi creador.");
              break;
            case 6: msg.reply(":8ball: Ni en pedo");
              break;
            case 7: msg.reply(":8ball: De verdad me estás preguntando esa pelotudez?");
              break;
            case 8: msg.reply(":8ball: Te juro por los goldfish y el Terraria que es así como dijiste");
              break;
            case 9: msg.reply(":8ball: No estoy seguro, pero me parece que no");
              break;
        }
    }
}

module.exports = new Bola8("!bola8");
