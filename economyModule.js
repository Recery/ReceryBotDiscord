const DB = require("better-sqlite3");

const db =  new DB(process.env.ECONOMY_DB_PATH);

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function modifyApples(userID, apples) {
    while (true) {
        try {
            db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);
            break;
        }
        catch (err) {
            if (err.code !== 'SQLITE_BUSY') throw err;
        }
    }
}

function getApples(userID) {
    while (true) {
        try {
            const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);

            if (row)
                return row.apples;
            else 
                return 0;
            
            break;
        }
        catch (err) {
            if (err.code !== 'SQLITE_BUSY') throw err;
        }
    }
}

module.exports = {
    modifyApples,
    getApples
};