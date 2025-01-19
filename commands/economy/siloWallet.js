const eco = require("../../economyModule.js");

module.exports = {
    name: "silowallet",
    alias: ["sw", "bal", "balance"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const userApples = eco.getApples(userID);

        msg.reply(messages[lang]);
    }
}

const messages = {
    es: "{{user}}, en total tienes {{apples}}:green_apple: en tu silolletera.",
    en: "{{user}}, you have {{apples}}:green_apple: in your silowallet."
}