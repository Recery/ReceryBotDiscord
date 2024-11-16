const Command = require("./command_cls.js")
const ListaItems = require(process.cwd() + "/Scripts/Items/ListaItems");

class Usar extends Command
{
    async execution(msg)
    {
        let content = msg.content.replace("!receryuse", "").trim();
        let item_exists = false;
        for (const item of ListaItems)
        {
            if (item.name === content || item.id === Number(content))
            {
                item_exists = true;
                let use = await item.use(this.get_mention(msg));
                if (use)
                {
                    item.use_effects(msg);
                }
                else msg.reply(`No has podido comprar el item.`)
            }
        }

        if (!item_exists) msg.reply("Ese item no existe.");
    }
}

module.exports = new Usar("!receryuse", "economia");