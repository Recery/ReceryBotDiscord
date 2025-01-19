const DB = require("better-sqlite3");

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function modifyApples(userID, apples) {
    const db =  new DB(process.env.ECONOMY_DB_PATH);

    db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);

    db.close();
}

function getApples(userID) {
    const db =  new DB(process.env.ECONOMY_DB_PATH);
    
    const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);
    db.close();

    if (row)
        return row.apples;
    else 
        return 0;
}

module.exports = {
    modifyApples,
    getApples
};