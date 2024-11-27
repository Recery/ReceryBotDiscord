const DB = require("better-sqlite3")

// Todo lo de si el bot está dormido
let asleep = false 
function set_asleep(new_state)
{
    asleep = new_state;
}
function get_asleep()
{
    return asleep;
}
// ------- //

function modify_green_apples(mention, amount)
{
    const db = new DB(process.env.ECONOMY_DB_PATH);

    let green_apples = 0;
    let id = 0;
    let add_row = true;

    const [rows] = db.prepare('SELECT * FROM green_apples').all() || [];

    for (const row of rows)
    {
        if (mention === row.user)
        {
            id = row.id;
            db.prepare(`UPDATE green_apples SET apples = apples + ${amount} WHERE id = ?`, [id]).run();
            
            const [updated_row] = db.prepare('SELECT apples FROM green_apples WHERE id = ?', [id]).all();
            green_apples = updated_row[0].apples;

            add_row = false;
            break;
        }
    }

    if (add_row)
    {
        db.prepare('INSERT INTO green_apples (user, apples) VALUES (?, ?)', [mention, green_apples + amount]).run();
        green_apples = amount;
    }

    return green_apples;
}

function get_green_apples(mention)
{
    const db = new DB(process.env.ECONOMY_DB_PATH);

    let green_apples = 0;
    let id = 0;

    const [rows] = db.prepare('SELECT * FROM green_apples').all();
    for (const row of rows)
    {
        if (mention === row.user)
        {
            green_apples = row.apples;
        }
    }

    return green_apples;
}

module.exports = { 
    set_asleep,
    get_asleep,
    modify_green_apples,
    get_green_apples
};
