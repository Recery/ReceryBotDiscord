const Command = require("./command_cls.js")

class BanDanny extends Command
{
    bans = 0;

    execution(msg)
    {
        this.bans += 1;
        msg.reply(`Danny le tocó el chilito a alguien y ${this.get_mention(msg)} lo baneó. Danny ya fue baneado ${this.bans} veces XD`);
    }
}

module.exports = new BanDanny("!bandanny");
