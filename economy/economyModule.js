const slimesModule = require("./slimesModule.js");
const DB = require("better-sqlite3");

const db =  new DB(process.env.DB_DIR + "economy.db");

// Se manda un valor nuevo para las manzanas y lo reemplaza completamente al valor anterior
function setApples(userID, apples) {
    db.prepare("INSERT OR REPLACE INTO greenApples (userId, apples) VALUES (?, ?)").run(userID, apples);
}

function getApples(userID) {
    const applesToAdd = cycleEffects(userID, resetCycle(userID));

    const row = db.prepare("SELECT apples FROM greenApples WHERE userId = ?").get(userID);

    if (row) {
        if (applesToAdd > 0) setApples(userID, row.apples + applesToAdd);
        return row.apples + applesToAdd;
    };
    
    return 0;
}

function cycleEffects(userID, completedCycles) {
    let applesToAdd = 0;
    if (completedCycles) {
        applesToAdd += resetCorral(userID);
        barnApplesGeneration(userID, completedCycles);
    }
    return applesToAdd;
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
        return 0;
    
    // Al llegar a este punto, significa que el cooldown ya se completó
    // Reiniciar el cooldown y devolver true para avisar que se reinició el ciclo
    const completedCycles = Math.floor(elapsedTime / hour);

    db.prepare("UPDATE slimeCyclesTimes SET startTime = ? WHERE userId = ?").run(row.startTime + (completedCycles * hour), userID);

    return completedCycles;
}

function getCycleTimeLeft(userID) {
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

    const row = db.prepare("SELECT startTime FROM slimeCyclesTimes WHERE userId = ?").get(userID);

    const hour = 1 * 60 * 60 * 1000;
    
    if (row) {
        const time = (row.startTime + hour) - Date.now();
        return time;
    }

    return 0;
}


function setBarnSizeSlimes(userID, size) {
    const applesSize = getBarnSizeApples(userID);
    db.prepare("INSERT OR REPLACE INTO barnLevel (userId, slimesSize, applesSize) VALUES (?, ?, ?)").run(userID, size, applesSize);
}

function getBarnSizeSlimes(userID) {
    const row = db.prepare("SELECT slimesSize FROM barnLevel WHERE userId = ?").get(userID);

    if (row) 
        if (row.slimesSize !== null) return row.slimesSize;

    return 3;
}

function setBarnSizeApples(userID, size) {
    const slimesSize = getBarnSizeSlimes(userID);
    db.prepare("INSERT OR REPLACE INTO barnLevel (userId, slimesSize, applesSize) VALUES (?, ?, ?)").run(userID, slimesSize, size);
}

function getBarnSizeApples (userID) {
    const row = db.prepare("SELECT applesSize FROM barnLevel WHERE userId = ?").get(userID);

    if (row) 
        if (row.applesSize !== null) return row.applesSize;

    return 10;
}

// Enviar la cantidad de ciclos completados, y sumar manzanas de cada slime por cada ciclo
function barnApplesGeneration(userID, cyclesCompleted) {
    const applesToAdd = getBarnApplesGeneration(userID) * cyclesCompleted;

    const applesInBarn = getBarnApples(userID);
    const barnSizeApples = getBarnSizeApples(userID);

    if (applesInBarn + applesToAdd <= barnSizeApples)
        setBarnApples(userID, applesInBarn + applesToAdd);
    else
        setBarnApples(userID, barnSizeApples);
}

// Devuelve la generacion por hora por ciclo
function getBarnApplesGeneration(userID) {
    let apples = 0;
    
    for (const data of getBarnSlimes(userID)) {
        const slime = data.obj;
        if (!slime) continue;
        apples += slime.appleGeneration * data.quantity;
    }

    return apples;
}

// Los dos siguientes metodos agregan o eliminan UN SOLO SLIME del granero
// Usar multiples veces si se necesitan agregar o eliminar mas
function addSlimeToBarn(userID, slimeID) {
    let newQuantity = 1;

    const row = db.prepare("SELECT quantity FROM barnSlimes WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO barnSlimes (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function removeSlimeFromBarn(userID, slimeID) {
    let newQuantity = 0;
    
    const row = db.prepare("SELECT quantity FROM barnSlimes WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity - 1;
    console.log(newQuantity, " Cantidad");
    if (newQuantity < 0) return; // No se pueden tener slimes negativos...
    else if (newQuantity === 0) {
        // Si hay cero slimes de este tipo, borrar el registro, y obviamente no insertar uno nuevo
        db.prepare("DELETE FROM barnSlimes WHERE userId = ? AND slimeId = ?").run(userID, slimeID);
        return;
    }

    db.prepare("INSERT OR REPLACE INTO barnSlimes (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function getBarnSlimes(userID) {
    const rows = db.prepare("SELECT slimeId, quantity FROM barnSlimes WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimesModule.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getBarnSlimesAmount(userID) {
    const rows = db.prepare("SELECT quantity FROM barnSlimes WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

function setBarnApples(userID, quantity) {
    db.prepare("INSERT OR REPLACE INTO barnApples (userId, quantity) VALUES (?, ?)").run(userID, quantity);
}

function getBarnApples(userID) {
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

    const row = db.prepare("SELECT quantity FROM barnApples WHERE userId = ?").get(userID);

    if (row) 
        if (row.quantity !== null) return row.quantity;

    return 0;
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
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

    let newQuantity = 1;

    const row = db.prepare("SELECT quantity FROM corral WHERE userId = ? AND slimeId = ?").get(userID, slimeID);
    if (row) newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO corral (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function removeSlimeFromCorral(userID, slimeID) {
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

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
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

    const rows = db.prepare("SELECT slimeId, quantity FROM corral WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimesModule.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

function getCorralSlimesAmount(userID) {
    const applesToAdd = cycleEffects(userID, resetCycle(userID));
    if (applesToAdd > 0)
        setApples(userID, getApples(userID) +  applesToAdd);

    const rows = db.prepare("SELECT quantity FROM corral WHERE userId = ?").all(userID);

    let slimesAmount = 0;

    for (const row of rows)
        slimesAmount += row.quantity;

    return slimesAmount;
}

function addSlimeToTotal(userID, slimeID) {
    let newQuantity = 1;
    const row = db.prepare("SELECT quantity FROM totalSlimes WHERE userId = ? AND slimeId = ?").get(userID, slimeID);

    if (row)
        newQuantity = row.quantity + 1;

    db.prepare("INSERT OR REPLACE INTO totalSlimes (userId, slimeId, quantity) VALUES (?, ?, ?)").run(userID, slimeID, newQuantity);
}

function getTotalSlimes(userID) {
    const rows = db.prepare("SELECT slimeId, quantity FROM totalSlimes WHERE userId = ?").all(userID);

    const slimesList = [];

    for (const row of rows)
        slimesList.push({obj: slimesModule.getSlime(row.slimeId), quantity: row.quantity});

    return slimesList;
}

module.exports = {
    setApples,
    getApples,
    getCycleTimeLeft,
    setBarnSizeSlimes,
    getBarnSizeSlimes,
    setBarnSizeApples,
    getBarnSizeApples,
    getBarnApplesGeneration,
    addSlimeToBarn,
    removeSlimeFromBarn,
    getBarnSlimes,
    getBarnSlimesAmount,
    getBarnApples,
    setBarnApples,
    resetCorral,
    addSlimeToCorral,
    removeSlimeFromCorral,
    getCorralSlimes,
    getCorralSlimesAmount,
    addSlimeToTotal,
    getTotalSlimes
};