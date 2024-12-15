const DB = require("better-sqlite3");
const { Collection } = require("discord.js");

// Solo una vez cuando se inicia el bot
// Carga todos los idiomas de cada server registrados en la base de datos
// Si un server no tiene idioma, se usa el por defecto (español)
function load_langs(client)
{
    client.langs = new Collection();

    const db = new DB(process.env.ADMIN_DB_PATH);
    const rows = db.prepare("SELECT serverid, lang FROM langs").all();

    for (const row of rows)
        client.langs.set(row.serverid, row.lang);
    
    db.close();
}

function set_lang(client, serverid, lang)
{
    const db = new DB(process.env.ADMIN_DB_PATH);

    const row = db.prepare("SELECT lang FROM langs WHERE serverid = ?").get(serverid);

    if (row)
        db.prepare("UPDATE langs SET lang = ? WHERE serverid = ?").run(lang, serverid);
    else
        db.prepare("INSERT INTO langs (serverid, lang) VALUES (?, ?)").run(serverid, lang);

    db.close();

    client.langs.set(serverid, lang);
}

module.exports = {
    load_langs,
    set_lang
}