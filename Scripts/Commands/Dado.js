const Command = require("./command_cls.js")

class Dado extends Command
{
    execution(msg)
    {
        var num = Math.floor(Math.random() * 10) + 1;
        
        msg.reply("Tiraste el dado :game_die: y salio: " + num)
    }
}

module.exports = new Dado("!dado", "diversion");