const DB = require("better-sqlite3");
const eco = require("../../economy/economyModule.js");
const timeModule = require("../../economy/timeModule.js");

const users = new Map();    

module.exports = {
    name: "hourly",
    alias: ["h"],
    category: "economy",
    description: {
        es: "Reclama una recompensa de 50 <:GreenApple:1296171434246410380> cada una hora.",
        en: "Claims a reward of 50 <:GreenApple:1296171434246410380> with a cooldown of one hour."
    },
    syntax: {
        es: "{{prefix}}hourly",
        en: "{{prefix}}hourly"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;
        
        const now = Date.now();
        const timeToClaim = 1 * 60 * 60 * 1000; // El tiempo que tarda en recargarse este comando tras ser usado

        const lastClaim = users.get(userID) || 0;

        if (now - lastClaim < timeToClaim) {
            const timeLeft = timeModule.getTimeMinimumExpressedUnit(eco.getCycleTimeLeft(userID));
            
            msg.reply(
                messages[lang].notClaimable
                .replace("{{time}}", timeLeft.time.toString())
                .replace("{{unit}}", timeModule.units[lang][timeLeft.unit])
            );
        }
        else {
            users.set(userID, now);
            saveDate(userID, now);

            const newApples = eco.getApples(userID) + 50;
            eco.setApples(userID, newApples);

            msg.reply(messages[lang].claimable.replace("{{apples}}", newApples.toString()));
        }
    }
}

const messages = {
    es: {
        claimable: "¡Felicidades! Reclamaste tu premio de 50<:GreenApple:1296171434246410380>.\n" + 
        "Ahora tienes {{apples}}<:GreenApple:1296171434246410380> en total.",
        notClaimable: "Todavía no puedes reclamar tu premio. Faltan `{{time}} {{unit}}`."
    },
    en: {
        claimable: "Congratulations! You claimed your 50<:GreenApple:1296171434246410380> prize.\n" +
        "You now have {{apples}}<:GreenApple:1296171434246410380>.",
        notClaimable: "You can't claim your prize yet. {{time}} {{unit}} left."
    }
}


// BASE DE DATOS

const db = new DB(process.env.DB_DIR + "economy.db");

function saveDate(userID, date) {
    db.prepare("INSERT OR REPLACE INTO hourlyCooldowns (userId, date) VALUES (?, ?)").run(userID, date);
}

loadDates(); // SOLO SE CARGA AL INICIAR EL BOT
function loadDates() {
    const rows = db.prepare("SELECT * FROM hourlyCooldowns").all();

    for (const row of rows)
        users.set(row.userId, row.date);
}

// --------------------------