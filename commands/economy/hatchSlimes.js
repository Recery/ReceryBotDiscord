const eco = require("../../economyModule.js");

module.exports = {
    name: "hatchslimes",
    alias: ["hs", "getslimes"],
    category: "economy",
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimesToHatch = args[0] || 1;
        const applesToSpend = slimesToHatch * 10;
        const userApples = await eco.getApples(userID);
        
        if (userApples < applesToSpend) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", applesToSpend.toString()));
        }
        else {
            await eco.modifyApples(userID, userApples - applesToSpend);

            let hatchedSlimes = "**" + messages[lang].slimeObtention + "**";
            for (let i = 0; i < slimesToHatch; i++) {
                hatchedSlimes += " - " + slimes[Math.floor(Math.random() * slimes.length)];
                if (i < slimesToHatch - 1) hatchedSlimes += "\n";
            }
            msg.reply(hatchedSlimes);
        }
    }
}

const slimes = [
    "green slime",
    "yellow slime",
    "white slime",
    "cosmic slime",
    "creamy slime",
    "poo slime",
    "goldfish slime",
    "mummified slime",
    "red slime",
    "blue slime"
]

const messages = {
    es: {
        needMoreApples: "¡No tienes suficientes :green_apple: para eclosionar esa cantidad de slimes!\nNecesitas {{apples}}:green_apple:.",
        slimeObtention: "¡Eclosionaste estos slimes!"
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to hatch that amount of slimes!\n You need {{apples}}:green_apple:.",
        slimeObtention: "You hatched these slimes!"
    }
}