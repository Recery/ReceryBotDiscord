const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "corraltimeleft",
    alias: ["ctimeleft", "ctl"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const timeleft = eco.getCorralResetTimeLeft(userID);

        const minutes = 1 + (timeleft / 1000) / 60;

        msg.reply(messages[lang].replace("{{minutes}", minutes.toString()));
    }
}

const messages = {
    es: "Tu corral se reiniciará en {{minutes}} minutos.",
    en: "Your corral will be reinitiated in {{minutes}} minutes."
}