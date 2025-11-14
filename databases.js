const DB = require("better-sqlite3");

function initActionDb() {
    const actionDb = new DB(process.env.DB_DIR + "action.db");

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

    // Tabla eat
    actionDb.prepare(`
        CREATE TABLE IF NOT EXISTS eat (
            firstUserId TEXT,
            secondUserId TEXT,
            quantity INTEGER,
            PRIMARY KEY("firstUserId", "secondUserId")
        )
    `).run();

    // Tabla fishmutations
    actionDb.prepare(`
        CREATE TABLE IF NOT EXISTS fishmutations (
            userId TEXT,
            quantity INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    // Tabla hydrate
    actionDb.prepare(`
        CREATE TABLE IF NOT EXISTS hydrate (
            userId TEXT,
            quantity INTEGER,
            PRIMARY KEY("userId")
        )
    `).run();

    actionDb.close();
}

function initAdminDb() {
    const adminDb = new DB(process.env.DB_DIR + "admin.db");

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

    adminDb.close();
}

function initEconomyDb() {
    const economyDb = new DB(process.env.DB_DIR + "economy.db");

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

    // Tabla leaderboards
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS leaderboardsAllows (
	        userId TEXT,
	        allowed INTEGER,
	        PRIMARY KEY("userId")
        )
    `).run();

    // Tabla banners
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS banners (
            name TEXT,
            endDate INTEGER,
            slimesIds TEXT,
            PRIMARY KEY("name")
        )
    `).run();

    // Tabla chosenBanners
    economyDb.prepare(`
        CREATE TABLE IF NOT EXISTS chosenBanners (
            userId TEXT,
            bannerName TEXT,
            PRIMARY KEY("userId")
        )
    `).run();

    economyDb.close();
}

function initFunDb() {
    const funDb = new DB(process.env.DB_DIR + "fun.db");

    // Tabla count
    funDb.prepare(`
        CREATE TABLE IF NOT EXISTS count (
            serverId TEXT,
            channelId TEXT,
            number INTEGER,
            PRIMARY KEY("channelId","serverId")
        )
    `).run();

    funDb.close();
}

function initSuperAdminDb() {
    const superAdminDb = new DB(process.env.DB_DIR + "superAdmin.db");

    // Tabla superadmins
    superAdminDb.prepare(`
        CREATE TABLE IF NOT EXISTS superAdmins (
            userId TEXT,
            PRIMARY KEY("userId")
        )
    `).run();

    superAdminDb.close();
}

function initDbs() {
    initActionDb();
    initAdminDb();
    initEconomyDb();
    initFunDb();
    initSuperAdminDb();
}

module.exports = {
    initDbs
}