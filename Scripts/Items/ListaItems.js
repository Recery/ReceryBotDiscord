const Item = require(process.cwd() + "/Scripts/Items/Item");

let items = [
    new Item("1", "Huevo de slime", "<:Huevo1:1298713803214688375>")
        .set_description("Un huevo para incubar un slime.")
        .set_shop_values(5,3)
]

module.exports = items;