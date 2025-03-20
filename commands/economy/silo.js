const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "silo",
    alias: ["bal", "balance"],
    category: "economy",
    description: {
        es: "Muestra la cantidad de <:GreenApple:1296171434246410380> que tienes.",
        en: "Shows how many <:GreenApple:1296171434246410380> you have."
    },
    syntax: {
        es: "{{prefix}}silo",
        en: "{{prefix}}silo"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const userApples = eco.getApples(userID);

        msg.reply(messages[lang].replace("{{apples}}", userApples.toString()));
    }
}

const messages = {
    es: "En total tienes {{apples}}<:GreenApple:1296171434246410380> en tu silo.",
    en: "You have {{apples}}<:GreenApple:1296171434246410380> in your silo."
}