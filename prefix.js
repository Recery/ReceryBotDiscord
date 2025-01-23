const DB = require("better-sqlite3");

function getPrefix(serverid)
{
    let prefix = "!";

    const db = new DB(process.env.ADMIN_DB_PATH);

    const row = db.prepare("SELECT prefix FROM prefixes WHERE serverid = ?").get(serverid);
    if (row) prefix = row.prefix;

    db.close();

    return prefix;
}

module.exports = {
    getPrefix
}