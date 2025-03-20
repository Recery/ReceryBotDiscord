const DB = require("better-sqlite3");

const actionDb = new DB(process.env.DB_DIR + "action.db");
const adminDb = new DB(process.env.DB_DIR + "admin.db");
const economyDb = new DB(process.env.DB_DIR + "economy.db");
const funDb = new DB(process.env.DB_DIR + "fun.db");

function initActionDb() {
    // Tabla bonks
    actionDb.prepare(`
        CREATE TABLE IF NOT EXISTS bonks (
            userId TEXT,
            quantity INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla hugs
    actionDb.prepare(`
        CREATE TABLE IF NOT EXISTS hugs (
            userId TEXT,
            quantity INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();
}

function initAdminDb() {
    // Tabla langs
    adminDb.prepare(`
        CREATE TABLE IF NOT EXISTS langs (
            serverId TEXT,
            lang TEXT,
            PRIMARY KEY("serverId")
        )
    `).run();

    // Tabla prefixes
    adminDb.prepare(`
        CREATE TABLE IF NOT EXISTS prefixes (
            serverId TEXT,
            prefix TEXT,
            PRIMARY KEY("serverId")
        )
    `).run();
}

function initEconomyDb() {
    // Tabla barnApples
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS barnApples (
            userId TEXT,
            quantity INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla barnLevel
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS barnLevel (
            userId TEXT,
            slimesSize INTEGER,
            applesSize	INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla barnSlimes
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS barnSlimes (
            userId	TEXT,
            slimeId	INTEGER,
            quantity INTEGER,
            PRIMARY KEY("userId","slimeId")
        )
    `).run();

    // Tabla corral
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS corral (
            userId TEXT,
            slimeId	INTEGER,
            quantity INTEGER,
            PRIMARY KEY("userId","slimeId")
        )
    `).run();

    // Tabla greenApples
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS greenApples (
            userId TEXT,
            apples INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla slimeCyclesTimes
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS slimeCyclesTimes (
            userId TEXT,
            startTime INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla totalSlimes
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS totalSlimes (
            userId TEXT,
            slimeId INTEGER,
            quantity INTEGER,
            PRIMARY KEY("userId","slimeId")
        )
    `).run();

    // Tabla hourlyCooldowns
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS hourlyCooldowns (
            userId TEXT,
            date INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();
}

function initFunDb() {
    // Tabla count
    funDb.prepare(`
        CREATE TABLE IF NOT EXISTS count (
            serverId TEXT,
            channelId TEXT,
            number INTEGER,
            PRIMARY KEY("channelId","serverId")
        )
    `).run();
}

function initDbs() {
    initActionDb();
    initAdminDb();
    initEconomyDb();
    initFunDb();
}

module.exports = {
    initDbs
}