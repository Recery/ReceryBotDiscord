const DB = require("better-sqlite3");

const db =  new DB(process.env.ECONOMY_DB_PATH);

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function modifyApples(userID, apples) {
    db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);
}

function getApples(userID) {
    const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);

    if (row)
        return row.apples;
    else 
        return 0;
}

module.exports = {
    modifyApples,
    getApples
};