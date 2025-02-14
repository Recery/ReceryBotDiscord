const DB = require("better-sqlite3");
const db = new DB(process.env.ADMIN_DB_PATH);

function getPrefix(serverID)
{
    let prefix = "r!";

    const row = db.prepare("SELECT prefix FROM prefixes WHERE serverId = ?").get(serverID);
    if (row) prefix = row.prefix;

    return prefix;
}

function setPrefix(serverID, newPrefix) {
    db.prepare("INSERT OR REPLACE INTO prefixes (serverId, prefix) VALUES (?, ?)").run(serverID, newPrefix);
}

function cleanPrefix(msg) {
    const prefix = getPrefix(msg.guildId);

    const content = msg.content.trim();

    const inputPrefix = content.slice(0, 6).toLowerCase();

    let cleanText = null;

    if (inputPrefix.startsWith("recery"))
        cleanText = content.slice(6, content.length).trim();
    else if (inputPrefix.startsWith(prefix))
        cleanText = content.slice(prefix.length, content.length).trim();

    return cleanText;
}

module.exports = {
    getPrefix,
    setPrefix,
    cleanPrefix
}