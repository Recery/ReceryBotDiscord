const DB = require("better-sqlite3");
//const Topgg = require("@top-gg/sdk")
//const topgg = new Topgg.Api(process.env.TOP_GG_TOKEN);
const eco = require("../../economy/economyModule.js");
const timeModule = require("../../economy/timeModule.js"); 

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
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userId = msg.author.id;
        
        const now = Date.now();
        const timeToClaim = 1 * 60 * 60 * 1000; // El tiempo que tarda en recargarse este comando tras ser usado

        const lastClaim = getDate(userId);

        if (now - lastClaim < timeToClaim) {
            const timeLeft = timeModule.getTimeMinimumExpressedUnit(eco.getCycleTimeLeft(userId));
            
            msg.reply(
                messages[lang].notClaimable
                    .replace("{{time}}", timeLeft.time.toString())
                    .replace("{{unit}}", timeModule.units[lang][timeLeft.unit])
            );
        }
        else {
            setDate(userId, now);

            let text = "";
            let newApples = eco.getApples(userId);
            /*
            try {
                if (await topgg.hasVoted(userId)) {
                    newApples += 60;
                    text = messages[lang].claimable + "\n" +
                        messages[lang].voted + "\n" +
                        messages[lang].haveNow.replace("{{apples}}", newApples.toString())
                }
                else {
                    newApples += 50;
                    text = messages[lang].claimable + "\n" +
                        messages[lang].haveNow.replace("{{apples}}", newApples.toString());
                }
            }
            catch {
                newApples += 50;
                text = messages[lang].claimable + "\n" +
                    messages[lang].haveNow.replace("{{apples}}", newApples.toString());
            }
            */

            newApples += 50;
            text = messages[lang].claimable + "\n" +
                messages[lang].haveNow.replace("{{apples}}", newApples.toString());

            eco.setApples(userId, newApples);

            msg.reply(text);
        }
    }
}

const messages = {
    es: {
        claimable: "¡Felicidades! Reclamaste tu premio de 50<:GreenApple:1296171434246410380>.",
        haveNow: "Ahora tienes {{apples}}<:GreenApple:1296171434246410380> en total.",
        voted: "¡Votaste por mí en las últimas 12 horas! Obtienes 10<:GreenApple:1296171434246410380> extra.",
        notClaimable: "Todavía no puedes reclamar tu premio. Faltan `{{time}} {{unit}}`."
    },
    en: {
        claimable: "Congratulations! You claimed your 50<:GreenApple:1296171434246410380> prize.",
        haveNow: "You now have {{apples}}<:GreenApple:1296171434246410380>.",
        voted: "You have voted for me in the last 12 hours! You got an extra 10<:GreenApple:1296171434246410380>.",
        notClaimable: "You can't claim your prize yet. {{time}} {{unit}} left."
    }
}


// BASE DE DATOS

const db = new DB(process.env.DB_DIR + "economy.db");

function setDate(userId, date) {
    db.prepare("INSERT OR REPLACE INTO hourlyCooldowns (userId, date) VALUES (?, ?)").run(userId, date);
}

function getDate(userId) {
    const row = db.prepare("SELECT date FROM hourlyCooldowns WHERE userId = ?").get(userId);

    if (row) return row.date;
    else return 0;
}

// --------------------------