const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "silowallet",
    alias: ["sw", "bal", "balance"],
    category: "economy",
    description: {
        es: "Muestra la cantidad de :green_apple: que tienes.",
        en: "Shows how many :green_apple: you have."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const userApples = eco.getApples(userID);

        msg.reply(messages[lang].replace("{{user}}", `<@${userID}>`).replace("{{apples}}", userApples.toString()));
    }
}

const messages = {
    es: "{{user}}, en total tienes {{apples}}:green_apple: en tu silolletera.",
    en: "{{user}}, you have {{apples}}:green_apple: in your silowallet."
}