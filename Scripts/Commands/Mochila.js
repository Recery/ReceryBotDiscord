const { EmbedBuilder } = require("discord.js");
const Command = require("./command_cls.js");
const economia = require(process.cwd() + "/Scripts/Items/Economia");

class Mochila extends Command
{
    async execution(msg)
    {
        let items = await economia.get_items_nice(this.get_mention(msg));

        let has_items = false;
        let reply = '';
        for (const item of items)
        {
            reply += `\n ${item.item.name} ${item.item.emote} (x${item.amount})`;
            has_items = true;
        }

        if (!has_items) reply += "\n¡No tenés nada! Alto indigente sos.";

        const embed = new EmbedBuilder()
            .setColor("#65a7fc")
            .setTitle(`Mochila de ${this.get_mention(msg)}`)
            .setDescription(reply);

        msg.reply({ embeds: [embed]});
    }
}

module.exports = new Mochila("!recerybag", "economia");