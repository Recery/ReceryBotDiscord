const DB = require("better-sqlite3");
const { Collection } = require("discord.js");

// Solo una vez cuando se inicia el bot
// Carga todos los idiomas de cada server registrados en la base de datos
// Si un server no tiene idioma, se usa el por defecto (español)
function loadLangs(client)
{
    client.langs = new Collection();

    const db = new DB(process.env.DB_DIR + "admin.db");
    const rows = db.prepare("SELECT serverId, lang FROM langs").all();

    for (const row of rows)
        client.langs.set(row.serverid, row.lang);
    
    db.close();
}

function setLang(client, serverID, lang)
{
    const db = new DB(process.env.DB_DIR + "admin.db");
    db.prepare("INSERT OR REPLACE INTO langs (serverId, lang) VALUES (?, ?)").run(serverID, lang);
    db.close();

    client.langs.set(serverID, lang);
}

const commandCategories = {
    es: {
        action: "Acción",
        administration: "Administración",
        economy: "Economía",
        fun: "Diversión",
        info: "Información"
    },
    en: {
        action: "Action",
        administration: "Administration",
        economy: "Economy",
        fun: "Fun",
        info: "Info"
    }
}

module.exports = {
    loadLangs,
    setLang,
    commandCategories
}