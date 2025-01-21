const corralTimeleft = require("../commands/economy/corralTimeleft.js");
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

    const row = db.prepare("SELECT quantity FROM barnContent WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) quantity = row.quantity;

    db.prepare("INSERT OR REPLACE INTO barnContent (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, quantity + 1);
}

function getBarnSlimes(userID) {
    const rows = db.prepare("SELECT * FROM barnContent WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimes.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getBarnSlimesAmount(userID) {
    const rows = db.prepare("SELECT quantity FROM barnContent WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

// Cada vez que se desee acceder al contenido del corral de alguna manera, hay que verificar si el corral ya se reinició
// Asegura que siempre el contenido del corral esté actualizado, y también da luz verde o roja para hacer ciertas acciones
// Normalmente se reinicia cada 1 hora
function verifyCorralReset(userID) {
    const row = db.prepare("SELECT time FROM corralReset WHERE userId = ?").get(userID);

    const now = Date.now();
    const hour = 1 * 60 * 60 * 1000; // 1 hora en milisegundos

    // No hay registro de cooldown de corral para este usuario, insertarlo
    if (!row) {
        db.prepare("INSERT INTO corralReset (userId, time) VALUES (?, ?)").run(userID, now);
        return false;
    }

    // Cooldown no completado
    if (now - row.time < hour) {
        return false;
    }
    
    // Llegado a este punto, significa que el cooldown ya se completó
    // Eliminar slimes del corral y reiniciar el cooldown
    db.prepare("DELETE FROM corral WHERE userId = ?").run(userID);

    db.prepare("UPDATE corralReset SET time = ? WHERE userId = ?").run(userID);

    return true;
}

function getCorralResetTimeLeft(userID) {
    verifyCorralReset(userID);

    const row = db.prepare("SELECT time FROM corralReset WHERE userId = ?").get(userID);

    if (row) return Date.now() - row.time;

    return 0;
}

// Mandarle un id de slime para agregar
function addSlimeToCorral(userID, slimeID) {
    verifyCorralReset(userID);

    let quantity = 0;

    const row = db.prepare("SELECT quantity FROM corral WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) quantity = row.quantity;

    db.prepare("INSERT OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, quantity + 1);
}

function getCorralSlimes(userID) {
    verifyCorralReset(userID);

    const rows = db.prepare("SELECT * FROM corral WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimes.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getCorralSlimesAmount(userID) {
    verifyCorralReset(userID);

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
    verifyCorralReset,
    getCorralResetTimeLeft,
    addSlimeToCorral,
    getCorralSlimes,
    getCorralSlimesAmount
};