const Command = require("./command_cls.js")
const ListaItems = require(process.cwd() + "/Scripts/Items/ListaItems");

class Comprar extends Command
{
    async execution(msg)
    {
        let content = msg.content.replace("!comprar", "").trim();
        let item_exists = false;
        console.log(ListaItems);
        for (const item in ListaItems)
        {
            console.log(Item);
            if (item.name === content || item.id === content)
            {
                item_exists = true;
                let bought = await item.buy(this.get_mention(msg));
                if (bought)
                {
                    msg.reply(`Has comprado ${item.name}${item.emote} con éxito.`)
                }
                else msg.reply(`No has podido comprar el item.`)
            }
        }

        if (!item_exists) msg.reply("Ese item no existe.");
    }
}

module.exports = new Comprar("!comprar");