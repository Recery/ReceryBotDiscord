const Command = require("./command_cls.js")

class ReceryInvite extends Command
{
    execution(msg)
    {
        msg.reply("> ¿Querés invitarme a tu server? \n > Podés hacerlo a través de este link: https://discord.com/oauth2/authorize?client_id=1295826584153882744&permissions=1689934340028480&integration_type=0&scope=bot+applications.commands")
    }
}

module.exports = new ReceryInvite("!receryinvite");￼Enter
