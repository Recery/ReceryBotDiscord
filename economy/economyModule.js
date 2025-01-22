const slimesModule = require("./slimesModule.js");
const DB = require("better-sqlite3");

const db =  new DB(process.env.ECONOMY_DB_PATH);

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function setApples(userID, apples) {
    db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);
}

function getApples(userID) {
    let applesToAdd = 0;
    const completedCycles = resetCycle(userID);
    if (completedCycles) {
        applesToAdd += resetCorral(userID);
        applesToAdd += barnApplesGeneration(userID, completedCycles);
    }

    const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);

    if (row) {
        if (applesToAdd > 0) setApples(userID, row.apples + applesToAdd);
        return row.apples + applesToAdd;
    };
    
    return 0;
}


// Cada una hora, ocurre un ciclo en la economia de los slimes
// En cada ciclo, se eliminan todos los slimes que habia en el corral y se suman manzanas verdes segun su capacidad de generacion
// Tambien cada del granero genera una cantidad de manzanas verdes segun su generacion
// Los slimes del granero no se pierden por ciclos
function resetCycle(userID) {
    const row = db.prepare("SELECT startTime FROM slimeCyclesTimes WHERE userId = ?").get(userID);

    const now = Date.now();
    const hour = 1 * 60 * 60 * 1000; // 1 hora en milisegundos

    // No hay registro de cooldown de corral para este usuario, insertarlo
    if (!row) {
        db.prepare("INSERT INTO slimeCyclesTimes (userId, startTime) VALUES (?, ?)").run(userID, now);
        return;
    }

    // Tiempo transcurrido desde el inicio del ultimo cooldown hasta esta verificacion
    const elapsedTime = now - row.startTime;

    // Cooldown no completado
    if (elapsedTime < hour)
        return;
    
    // Al llegar a este punto, significa que el cooldown ya se completó
    // Reiniciar el cooldown y devolver true para avisar que se reinició el ciclo
    const completedCycles = Math.floor(elapsedTime / hour);

    db.prepare("UPDATE slimeCyclesTimes SET startTime = ? WHERE userId = ?").run(row.startTime + (completedCycles * hour), userID);

    return completedCycles;
}

function getCycleTimeLeft(userID) {
    resetCycle(userID);

    const row = db.prepare("SELECT time FROM slimeCyclesTimes WHERE userId = ?").get(userID);

    const hour = 1 * 60 * 60 * 1000;
    
    if (row) {
        const time = (row.time + hour) - Date.now();
        return time;
    }

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

// Enviar la cantidad de ciclos completados, y sumar manzanas de cada slime por cada ciclo
function barnApplesGeneration(userID, cyclesCompleted) {
    let applesToAdd = 0;

    for (const data of getBarnSlimes(userID)) {
        const slime = data.obj;
        if (!slime) continue;
        applesToAdd += slime.appleGeneration * data.quantity * cyclesCompleted;
    }

    return applesToAdd;
}

// Los dos siguientes metodos agregan o eliminan UN SOLO SLIME del granero
// Usar multiples veces si se necesitan agregar o eliminar mas
function addSlimeToBarn(userID, slimeID) {
    let newQuantity = 1;

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
        slimesList.push({obj: slimesModule.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getBarnSlimesAmount(userID) {
    const rows = db.prepare("SELECT quantity FROM barnContent WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

// Reinicia el corral y devuelve las manzanas que hay que agregar 
function resetCorral(userID) {
    let applesToAdd = 0;

    for (const data of getCorralSlimes(userID)) {
        const slime = data.obj;
        if (!slime) continue;
        applesToAdd += slime.appleGeneration * data.quantity;
    }

    db.prepare("DELETE FROM corral WHERE userId = ?").run(userID);

    return applesToAdd;
}

// Mandarle un id de slime para agregar
function addSlimeToCorral(userID, slimeID) {
    if (resetCycle(userID)) resetCorral(userID);

    let newQuantity = 1;

    const row = db.prepare("SELECT quantity FROM corral WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function removeSlimeFromCorral(userID, slimeID) {
    if (resetCycle(userID)) resetCorral(userID);

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
    if (resetCycle(userID)) resetCorral(userID);

    const rows = db.prepare("SELECT slimeId, quantity FROM corral WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimesModule.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getCorralSlimesAmount(userID) {
    if (resetCycle(userID)) resetCorral(userID);

    const rows = db.prepare("SELECT quantity FROM corral WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

module.exports = {
    setApples,
    getApples,
    resetCycle,
    getCycleTimeLeft,
    setBarnSize,
    getBarnSize,
    addSlimeToBarn,
    removeSlimeFromBarn,
    getBarnSlimes,
    getBarnSlimesAmount,
    resetCorral,
    addSlimeToCorral,
    removeSlimeFromCorral,
    getCorralSlimes,
    getCorralSlimesAmount
};