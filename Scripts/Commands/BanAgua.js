const Command = require("./command_cls.js")

class BanAgua extends Command
{
    bans = 0;

    execution(msg)
    {
        this.bans += 1;
        msg.reply(`${this.get_mention(msg)} acabó de banear a Agua. Agua ya fue baneado ${this.bans} veces XD`);
    }
}

module.exports = new BanAgua("!banagua");