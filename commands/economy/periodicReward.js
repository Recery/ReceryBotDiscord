const DB = require("better-sqlite3");

const users = new Map();    

module.exports = {
    name: "periodicreward",
    alias: ["pr"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        
        const now = Date.now();
        const twoHours = /*2 * 60 * 60 * */ 120000; // Así se obtiene 2 horas en milisegundos

        const lastClaim = users.get(msg.author.id) || 0;

        if (now - lastClaim < twoHours) {
            const timeLeft = twoHours - (now - lastClaim); // Tiempo restante en milisegundos
            const minutes = Math.floor(1 + (timeLeft / 1000) / 60);
            msg.reply("Cant claim. Time left: `" + minutes.toString() + " minutes`");
        }
        else {
            users.set(msg.author.id, now);
            saveDate(msg.author.id, now);
            msg.reply("Claimed")
        }
    }
}


// BASE DE DATOS

const db = new DB(process.env.COOLDOWNS_DB_PATH);

function saveDate(userID, date) {
    db.prepare("INSERT OR REPLACE INTO periodicReward (userId, date) VALUES (?, ?)").run(userID, date);
}

loadDates(); // SOLO SE CARGA AL INICIAR EL BOT
function loadDates() {
    const rows = db.prepare("SELECT * FROM periodicReward").all();

    for (const row of rows)
        users.set(row.userId, row.date);
}

// --------------------------