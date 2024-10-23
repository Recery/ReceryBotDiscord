const mysql = require('mysql2/promise')
const bot_state = require(process.cwd() + "/Scripts/bot_state");

class Item
{
    constructor(init_id, init_name, init_emote)
    {
        this.id = init_id;
        this.name = init_name;
        this.emote = init_emote;
        this.description = "Esta es la descripcion del item.";

        this.buy = -1;
        this.sell = -1;
    }

    set_description(new_description){this.description = new_description;}
    set_shop_values(new_buy, new_sell)
    {
        this.buy_price = new_buy;
        this.sell_price = new_sell;
    }

    get_description(){return this.description;}
    get_buy_value(){return this.buy_price;}
    get_sell_value(){return this.sell_price;}
    get_bot_state(){return bot_state;}

    async buy(mention)
    {
        if (this.buy_price < 0) return false; // Item no comprable

        let user_green_apples = await this.get_bot_state().get_green_apples(mention);
        if (this.buy_price > user_green_apples) return false;

        // En este punto el item se puede comprar, así que proceder con eso

        await this.get_bot_state().modify_green_apples(mention, this.buy_price);

        // Añadir el item a la mochila
        const conex = await mysql.createConnection({
            uri: process.env.db,
            ssl: {rejectUnauthorized: false}
        });

        const [rows] = await conex.execute('SELECT * FROM users_bags');

        let add_row = true;
        let new_bag = [];

        for (const row of rows)
        {
            if (row.mention === mention)
            {
                let has_item = false;
                let items = row.items.split(";");

                for (const item of items)
                {
                    let [id, amount] = item.split(":").map(Number);

                    if (id === this.id)
                    {
                        new_bag.push(`${id}:${amount+1}`);
                        has_item = true;
                    }
                    else new_bag.push(item);
                }
                if (!has_item) new_bag.push(`${this.id}:1`)
                await conex.execute(`UPDATE users_bags SET items = ? WHERE id = ?`, [new_bag.join(";"), row.id]);

                add_row = false;
                break;
            }
        }

        if (add_row)
        {
            await conex.execute('INSERT INTO users_bags (mention, items) VALUES (?, ?)', [mention, new_bag.join(";")]);
        }

        conex.end();

        return true;
    }

    use(){}
}

module.exports = Item;