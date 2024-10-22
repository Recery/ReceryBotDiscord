const mysql = require('mysql2/promise')

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

async function modify_green_apples(mention, amount)
{
    const conex = await mysql.createConnection({
        uri: process.env.db,
        ssl: {rejectUnauthorized: false}
    });

    let green_apples = 0;
    let id = 0;
    let add_row = true;

    const [rows] = await conex.execute('SELECT * FROM users_green_apples');
    for (const row of rows)
    {
        if (mention === row.mention)
        {
            id = row.id;
            await conex.execute(`UPDATE users_green_apples SET green_apples = green_apples + ${amount} WHERE id = ?`, [id]);
            
            const [updated_row] = await conex.execute('SELECT green_apples FROM users_green_apples WHERE id = ?', [id]);
            green_apples = updated_row[0].green_apples;

            add_row = false;
            break;
        }
    }

    if (add_row)
    {
        await conex.execute('INSERT INTO users_green_apples (mention, green_apples) VALUES (?, ?)', [mention, green_apples + amount]);
    }

    await conex.end();

    return green_apples;
}

async function get_green_apples(mention)
{
    const conex = await mysql.createConnection({
        uri: process.env.db,
        ssl: {rejectUnauthorized: false}
    });

    let green_apples = 0;
    let id = 0;

    const [rows] = await conex.execute('SELECT * FROM users_green_apples');
    for (const row of rows)
    {
        if (mention === row.mention)
        {
            green_apples = row.green_apples;
        }
    }

    conex.end();

    return green_apples;
}

module.exports = { 
    set_asleep,
    get_asleep,
    modify_green_apples,
    get_green_apples
};