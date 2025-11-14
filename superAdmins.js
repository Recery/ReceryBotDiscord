const DB = require("better-sqlite3");

function loadSuperAdmins(client) {
    client.superAdmins = new Set();

    const db = new DB(process.env.DB_DIR + "superAdmin.db");

    const rows = db.prepare("SELECT * FROM superAdmins").all();
    for (const row of rows)
        client.superAdmins.add(row.userId);

    db.close();
}

function addSuperAdmin(client, userId) {
    client.superAdmins.add(userId);

    const db = new DB(process.env.DB_DIR + "superAdmin.db");

    db.prepare("INSERT OR IGNORE INTO superAdmins (userId) VALUES (?)").run(userId);

    db.close();
}

function removeSuperAdmin(client, userId) {
    client.superAdmins.delete(userId);

    const db = new DB(process.env.DB_DIR + "superAdmin.db");

    db.prepare("DELETE FROM superAdmins WHERE userId = ?").run(userId);

    db.close();
}

module.exports = {
    loadSuperAdmins,
    addSuperAdmin,
    removeSuperAdmin
}
