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

// Mandarle un id de slime para agregar
function addSlimeToBarn(userID, slimeID) {
    let quantity = 0;

    for (const slime of getBarnSlimes(userID)) {
        if (slime.slime.id === slimeID) quantity += slime.quantity;
        break;
    }

    db.prepare("UPDATE OR REPLACE INTO barnContent (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, quantity + 1);
}

function getBarnSlimes(userID) {
    const rows = db.prepare("SELECT * FROM barnContent WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({slime: slimes.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getBarnSlimesAmount(userID) {
    const rows = db.prepare("SELECT quantity FROM barnContent WHERE userId = ?").get(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

// Mandarle un id de slime para agregar
function addSlimeToCorral(userID, slimeID) {
    let quantity = 0;

    for (const slime of getCorralSlimes(userID)) {
        if (slime.slime.id === slimeID) quantity += slime.quantity;
        break;
    }

    db.prepare("UPDATE OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, quantity + 1);
}

function getCorralSlimes(userID) {
    const rows = db.prepare("SELECT * FROM corral WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({slime: slimes.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getCorralSlimesAmount(userID) {
    const rows = db.prepare("SELECT quantity FROM corral WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

module.exports = {
    setApples,
    getApples,
    setBarnSize,
    getBarnSize,
    addSlimeToBarn,
    getBarnSlimes,
    getBarnSlimesAmount,
    addSlimeToCorral,
    getCorralSlimes,
    getCorralSlimesAmount
};