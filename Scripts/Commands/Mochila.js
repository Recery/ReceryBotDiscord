const Command = require("./command_cls.js");
const economia = require(process.cwd() + "/Scripts/Items/Economia");

class Mochila extends Command
{
    async execution(msg)
    {
        let items = await economia.get_items_nice(this.get_mention(msg));

        let has_items = false;
        let reply = `${this.get_mention(msg)}, estos son los items que tienes en tu mochila:`;
        for (const item of items)
        {
            reply += `\n x${item.amount} ${item.item.name}${item.item.emote}`;
            has_items = true;
        }

        if (!has_items) reply += "¡No tenés nada! Alto indigente sos.";

        msg.reply(reply);
    }
}

module.exports = new Mochila("!mochila");