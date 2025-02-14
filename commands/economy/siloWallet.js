const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "silowallet",
    alias: ["sw", "bal", "balance"],
    category: "economy",
    description: {
        es: "Muestra la cantidad de <:GreenApple:1296171434246410380> que tienes.",
        en: "Shows how many <:GreenApple:1296171434246410380> you have."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const userApples = eco.getApples(userID);

        msg.reply(messages[lang].replace("{{user}}", `<@${userID}>`).replace("{{apples}}", userApples.toString()));
    }
}

const messages = {
    es: "{{user}}, en total tienes {{apples}}<:GreenApple:1296171434246410380> en tu silolletera.",
    en: "{{user}}, you have {{apples}}<:GreenApple:1296171434246410380> in your silowallet."
}