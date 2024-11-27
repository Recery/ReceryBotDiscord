/// Metodos utiles de economia
const DB = require("better-sqlite3");
const ListaItems = require(process.cwd() + "/Scripts/Items/ListaItems.js");

// Devuelve un array con todos los items de un usuario
async function get_items(mention)
{
    const db = new DB(process.env.ECONOMY_DB_PATH);

    const rows = db.prepare('SELECT * FROM bags').all() || [];

    let bag = [];
    for (const row of rows)
    {
        if (row.username === mention)
        {
            let items = row.items.split(";");
            for (const item in items) bag.push(item);
        }
    }

    return bag;
}

// Devuelve un array con todos los items de un usuario en modo completo, generalmente para usarlo como display al usuario
async function get_items_nice(mention)
{
    const db = new DB(process.env.ECONOMY_DB_PATH);

    const rows = db.prepare('SELECT * FROM bags').all() || [];

    let bag = [];
    for (const row of rows)
    {
        if (row.username === mention)
        {
            let items = row.items.split(";");
            for (const item of items)
            {
                let [id, amount] = item.split(":").map(Number);
                bag.push({id: id, amount: amount});
            }
        }
    }

    let nice_bag = [];
    for (const item of bag)
    {
        for (const nice_item of ListaItems)
        {
            if (item.id === nice_item.id)
            {
                nice_bag.push({item: nice_item, amount: item.amount});
            }
        }
    }

    return nice_bag;
}

module.exports = {
    get_items,
    get_items_nice
}