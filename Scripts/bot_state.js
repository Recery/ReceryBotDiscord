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


}

module.exports = { 
    set_asleep,
    get_asleep,
    modify_green_apples
};