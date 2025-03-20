const eco = require("../../economy/economyModule.js");
const timeModule = require("../../economy/timeModule.js");

module.exports = {
    name: "cycletimeleft",
    alias: ["ctimeleft", "ctl"],
    category: "economy",
    description: {
        es: "Muestra el tiempo restante para completar un ciclo. Después de cada ciclo:\n" +
        "Slimes de tu granero generarán <:GreenApple:1296171434246410380> y los de tu corral se irán.",
        en: "Show the time left to complete a cycle. After each cycle:\n" +
        "Slimes from your barn will generate <:GreenApple:1296171434246410380> y the ones from your corral will leave."
    },
    syntax: {
        es: "{{prefix}}cycletimeleft",
        en: "{{prefix}}cycletimeleft"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const timeleft = timeModule.getTimeMinimumExpressedUnit(eco.getCycleTimeLeft(userID));

        msg.reply(
            messages[lang]
            .replace("{{time}}", timeleft.time.toString())
            .replace("{{unit}}", timeModule.units[lang][timeleft.unit])
        );
    }
}

const messages = {
    es: "Tu ciclo se completará en {{time}} {{unit}}.",
    en: "Your cycle will be completed in {{time}} {{unit}}."
}