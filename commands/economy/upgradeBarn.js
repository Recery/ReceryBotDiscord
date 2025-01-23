const eco = require("../../economy/economyModule.js");
const { description } = require("./hatchSlimes.js");

module.exports = {
    name: "upgradebarn",
    alias: ["mejorargranero", "barnupgrade", "mejoradegranero"],
    category: "economy",
    description: {
        es: "Mejora tu granero para tener +1 de capacidad de slimes.",
        en: "Upgrades your barn to get +1 slime capacity."
    },
    examples: ["{{prefix}}upgradebarn"],
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const currentSize = eco.getBarnSize(userID);
        const upgradePrize = currentSize * 50;
        const userApples = eco.getApples(userID);

        if (userApples < upgradePrize) {
            msg.reply(messages[lang].needMoreApples.replace("{{apples}}", upgradePrize));
            return;
        }

        const newSize = currentSize + 1;
        eco.setApples(userID, userApples - upgradePrize);
        eco.setBarnSize(userID, newSize);

        msg.reply(messages[lang].upgraded.replace("{{size}}", newSize));
    }
}

const messages = {
    es: {
        needMoreApples: "¡No tienes suficientes :green_apple: para mejorar tu granero de slimes!\nNecesitas {{apples}}:green_apple:.",
        upgraded: "¡Haz mejorado tu granero de slimes!\nAhora tiene capacidad para {{size}} slimes."
    },
    en: {
        needMoreApples: "You don't have enough :green_apple: to upgrade your slime barn!\nYou need {{apples}}:green_apple:.",
        upgraded: "Your slime barn has been upgraded!\nIt now has size for {{size}} slimes."
    }
}