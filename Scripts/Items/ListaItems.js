const Item = require(process.cwd() + "/Scripts/Items/Item");

let items = [
    get_item(1, "Huevo de slime", "<:Huevo1:1298713803214688375>", "Un huevo para incubar un slime.", 5, 3)
]

function get_item(id, name, emote, description, buy = -1, sell = -1)
{
    let item = new Item(id, name, emote);
    item.set_description(description);
    item.set_shop_values(buy, sell);
    return item;
}

module.exports = items;