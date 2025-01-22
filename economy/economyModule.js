const slimes = require("./slimesModule.js");
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

// Los dos siguientes metodos agregan o eliminan UN SOLO SLIME del granero
// Usar multiples veces si se necesitan agregar o eliminar mas
function addSlimeToBarn(userID, slimeID) {
    let newQuantity = 0;

    const row = db.prepare("SELECT quantity FROM barnContent WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO barnContent (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function removeSlimeFromBarn(userID, slimeID) {
    let newQuantity = 0;
    
    const row = db.prepare("SELECT quantity FROM barnContent WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity - 1;
    if (newQuantity <= 0) return; // No se pueden tener slimes negativos...
    else if (newQuantity === 0) {
        // Si hay cero slimes de este tipo, borrar el registro, y obviamente no insertar uno nuevo
        db.prepare("DELETE FROM barnContent WHERE userId = ? AND slimeId = ?").run(userID, slimeID);
    }

    db.prepare("INSERT OR REPLACE INTO barnContent (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, quantity - 1);
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

    // Tiempo transcurrido desde el inicio del ultimo cooldown hasta esta verificacion
    const elapsedTime = now - row.time;

    // Cooldown no completado
    if (elapsedTime < hour) {
        return false;
    }
    
    // Llegado a este punto, significa que el cooldown ya se completó
    // Eliminar slimes del corral y reiniciar el cooldown
    db.prepare("DELETE FROM corral WHERE userId = ?").run(userID);

    const completedCycles = Math.floor(elapsedTime / hour);

    db.prepare("UPDATE corralReset SET time = ? WHERE userId = ?").run(row.time + (completedCycles * hour), userID);

    return true;
}

function getCorralResetTimeLeft(userID) {
    verifyCorralReset(userID);

    const row = db.prepare("SELECT time FROM corralReset WHERE userId = ?").get(userID);

    const hour = 1 * 60 * 60 * 1000;
    
    if (row) {
        const time = (row.time + hour) - Date.now();
        return time;
    }

    return 0;
}

// Mandarle un id de slime para agregar
function addSlimeToCorral(userID, slimeID) {
    verifyCorralReset(userID);

    let newQuantity = 0;

    const row = db.prepare("SELECT quantity FROM corral WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity + 1);
}

function removeSlimeFromCorral(userID, slimeID) {
    verifyCorralReset(userID);

    let newQuantity = 0;

    const row = db.prepare("SELECT quantity FROM corral WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity - 1;

    if (newQuantity < 0) return; // No se pueden tener slimes negativos...
    else if (newQuantity === 0) {
        // Si hay cero slimes de este tipo, borrar el registro, y obviamente no insertar uno nuevo
        db.prepare("DELETE FROM corral WHERE userId = ? AND slimeId = ?").run(userID, slimeID);
        return;
    }

    db.prepare("INSERT OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
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
    removeSlimeFromBarn,
    getBarnSlimes,
    getBarnSlimesAmount,
    verifyCorralReset,
    getCorralResetTimeLeft,
    addSlimeToCorral,
    removeSlimeFromCorral,
    getCorralSlimes,
    getCorralSlimesAmount
};