const Command = require("./command_cls.js");
const economia = require(process.cwd() + "/Scripts/Items/Economia");

class Mochila extends Command
{
    async execution(msg)
    {
        let items = await economia.get_items_nice(this.get_mention(msg));
        console.log(items);

        let has_items = false;
        let reply = `${this.get_mention(msg)}, estos son los items que tienes en tu mochila:`;
        for (const item of items)
        {
            reply += `\n ${item.item.name} ${item.item.emote} (x${item.amount})`;
            has_items = true;
        }

        if (!has_items) reply += "\n¡No tenés nada! Alto indigente sos.";

        msg.reply(reply);
    }
}

module.exports = new Mochila("!recerybag");