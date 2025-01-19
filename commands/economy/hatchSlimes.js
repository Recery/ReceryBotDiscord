const eco = require("../../economyModule.js");

module.exports = {
    name: "hatchslimes",
    alias: ["hs", "getslimes"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimesToHatch = args[0] || 1;
        const applesToSpend = slimesToHatch * 10;
        const userApples = eco.getApples(userID);
        
        if (userApples < applesToSpend) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", applesToSpend.toString()));
        }
    }
}

const messages = {
    es: {
        needMoreApples: "¡No tienes suficientes :green_apple: para eclosionar esa cantidad de slimes!\nNecesitas {{apples}}:green_apple:."
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to hatch that amount of slimes!\n You need {{apples}}:green_apple:."
    }
}