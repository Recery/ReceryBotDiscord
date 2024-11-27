const DB = require("better-sqlite3")
const bot_state = require(process.cwd() + "/Scripts/bot_state");

class Item
{
    constructor(init_id, init_name, init_emote)
    {
        this.id = init_id;
        this.name = init_name;
        this.emote = init_emote;
        this.description = "Esta es la descripcion del item.";

        this.buy_price = -1;
        this.sell_price = -1;
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

    buy(mention)
    {
        if (this.buy_price < 0) return false; // Item no comprable

        let user_green_apples = this.get_bot_state().get_green_apples(mention);
        if (this.buy_price > user_green_apples) return false;

        // En este punto el item se puede comprar, así que proceder con eso

        this.get_bot_state().modify_green_apples(mention, -this.buy_price);

        // Añadir el item a la mochila
        const db = new DB(process.env.ECONOMY_DB_PATH)

        const [rows] = db.prepare('SELECT * FROM users_bags').all();

        let add_row = true;
        let new_bag = [];

        for (const row of rows)
        {
            if (row.user === mention)
            {
                let has_item = false;
                let items = row.items.split(";");

                for (const item of items)
                {
                    let [id, amount] = item.split(":").map(Number);
                    if (id === Number(this.id))
                    {
                        new_bag.push(`${id}:${amount+1}`);
                        has_item = true;
                    }
                    else new_bag.push(item);
                }
                if (!has_item) new_bag.push(`${this.id}:1`)
                db.prepare(`UPDATE bags SET items = ? WHERE id = ?`, [new_bag.join(";"), row.id]).run();

                add_row = false;
                break;
            }
        }

        if (add_row)
        {
            db.prepare('INSERT INTO bags (user, items) VALUES (?, ?)', [mention, `${this.id}:1`]).run();
        }

        return true;
    }

    use(mention)
    {
        const db = new DB(process.env.ECONOMY_DB_PATH)

        const [rows] = db.prepare('SELECT * FROM bags').all();

        let new_bag = [];
        let has_item = false;

        for (const row of rows)
        {
            if (row.user === mention) // El usuario que uso el comando es este
            {
                let items = row.items.split(";");

                for (const item of items)
                {
                    let [id, amount] = item.split(":").map(Number);

                    if (amount <= 0) continue; // no hay de ese item, no hay que agregarlo a la mochila

                    if (id === Number(this.id))
                    {
                        has_item = true;
                        if (amount - 1 > 0)
                            new_bag.push(`${id}:${amount-1}`);
                    }
                    else new_bag.push(item);
                }

                db.prepare(`UPDATE bags SET items = ? WHERE id = ?`, [new_bag.join(";"), row.id]).run();
                break;
            }
        }

        return has_item;
    }

    use_effects(msg)
    {
        msg.reply(`Usaste el item ${this.name} ${this.emote}`)
    }
}

module.exports = Item;