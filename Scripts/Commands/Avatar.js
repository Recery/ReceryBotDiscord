const Command = require("./command_cls.js")

class Avatar extends Command
{
    execution(msg)
    {
        msg.reply(
        {
            content: `${this.get_mention(msg)}, tu foto de perfil: `,
            files: [{
                attachment: msg.author.avatarUrl(), 
                name: "avatar.png"
            }]
        });
    }
}

module.exports = new Avatar("!avatar", "diversion");