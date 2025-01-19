const slimes = require("./slimes.js");
const DB = require("better-sqlite3");

const db =  new DB(process.env.ECONOMY_DB_PATH);

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function setApples(userID, apples) {
    db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);
}

function getApples(userID) {
    const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);

    if (row) return row.apples;
    
    return 0;
}

function setBarnSize(userID, size) {
    db.prepare("INSERT OR REPLACE INTO barnSize (userId, size) VALUES (?, ?)").run(userID, size);
}

function getBarnSize(userID) {
    const row = db.prepare("SELECT size FROM barnSize WHERE userId = ?").get(userID);

    if (row) return row.size;

    return 3;
}

// Mandarle un objeto de slime para agregar
function addSlimeToBarn(userID, slime) {

    db.prepare("UPDATE OR REPLACE INTO barnContent (userID, ) ")
}

function getBarnSlimes(userID) {
    const row = db.prepare("SELECT slimes FROM barnContent WHERE userId = ?").get(userID);

    const slimesList = [];
    
    if (!row) return slimesList;

    const objectStrings = row.slimes.split(";");
    for (const str of objectStrings) {
        const [id, amount] = str.split(":");

        for (const slime of slimes.slimes) {
            if (slime.id === Number(id)) {
                slimesList.push({slime: slime, amount: amount});
                break;
            }
        }
    }

    return slimesList;
}

function getBarnSlimesAmount(userID) {
    const row = db.prepare("SELECT slimes FROM barnContent WHERE userId = ?").get(userID);

    let slimesAmount = 0;

    if (!row) return slimesAmount;

    const objectStrings = row.slimes.split(";");

    for (const str of objectStrings) {
        const data = str.split(":");
        slimesAmount += Number(data[1]);
    }

    return slimesAmount;
}

module.exports = {
    setApples,
    getApples,
    setBarnSize,
    getBarnSize,
    addSlimeToBarn,
    getBarnSlimes,
    getBarnSlimesAmount
};