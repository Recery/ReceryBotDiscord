const Command = require("./command_cls.js")

class BanKubo extends Command
{
    bans = 0;

    execution(msg)
    {
        this.bans += 1;
        msg.reply(`Kubo acabó de mandar patas y ${this.get_mention(msg)} lo baneó. Kubo ya fue baneado ${this.bans} veces XD`);
    }
}

module.exports = new BanKubo("!bankubo");
