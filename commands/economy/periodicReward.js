const DB = require("better-sqlite3");
const eco = require("../../economyModule.js");

const users = new Map();    

module.exports = {
    name: "periodicreward",
    alias: ["pr"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;
        
        const now = Date.now();
        const timeToClaim = /*2 * 60 * 60 * */ 60000; // El tiempo que tarda en recargarse este comando tras ser usado

        const lastClaim = users.get(userID) || 0;

        if (now - lastClaim < timeToClaim) {
            const timeLeft = timeToClaim - (now - lastClaim); // Tiempo restante en milisegundos
            const minutes = Math.floor(1 + (timeLeft / 1000) / 60);
            
            msg.reply(messages[lang].notClaimable.replace("{{minutes}}", minutes.toString()));
        }
        else {
            users.set(userID, now);
            saveDate(userID, now);

            const newApples = eco.getApples(userID) + 100;
            eco.modifyApples(userID, newApples);

            msg.reply(messages[lang].claimable.replace("{{apples}}", newApples.toString()));
        }
    }
}

const messages = {
    es: {
        claimable: "¡Felicidades! Reclamaste tu premio de 100:green_apple:. \n Ahora tienes {{apples}}:green_apple: en total.",
        notClaimable: "Todavía no puedes reclamar tu premio. Faltan {{minutes}} minutos."
    },
    en: {
        claimable: "Congratulations! You claimed your 100:green_apple: prize. \n You now have {{apples}}:green_apple:.",
        notClaimable: "You can't claim your prize yet. {{minutes}} minutes left."
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