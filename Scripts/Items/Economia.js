/// Metodos utiles de economia
const mysql = require('mysql2/promise');
const ListaItems = require(process.cwd() + "/Scripts/Items/ListaItems");

async function get_conex()
{
    const conex = await mysql.createConnection({
        uri: process.env.db,
        ssl: {rejectUnauthorized: false}
    });
    return conex;
}

// Devuelve un array con todos los items de un usuario
async function get_items(mention)
{
    const conex = get_conex();

    const [rows] = await conex.execute('SELECT * FROM users_bags');

    let bag = [];
    for (const row of rows)
    {
        if (row.mention === mention)
        {
            let items = row.items.split(";");
            for (const item in items) bag.push(item);
        }
    }

    await conex.end();

    return bag;
}

// Devuelve un array con todos los items de un usuario en modo completo, generalmente para usarlo como display al usuario
async function get_items_nice(mention)
{
    const conex = await get_conex();

    const [rows] = await conex.execute('SELECT * FROM users_bags');

    let bag = [];
    for (const row of rows)
    {
        if (row.mention === mention)
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
            if (item.id === Number(nice_item.id))
            {
                nice_bag.push({item: nice_item, amount: item.amount});
            }
        }
    }

    await conex.end();

    return nice_bag;
}

module.exports = {
    get_items,
    get_items_nice
}