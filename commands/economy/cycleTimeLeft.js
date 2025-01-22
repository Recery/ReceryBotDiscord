const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "cycletimeleft",
    alias: ["ctimeleft", "ctl"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const timeleft = eco.getCycleTimeLeft(userID);

        // Obtener minutos, en base a los minutos ver si debe expresar el tiempo en horas, minutos o segundos 
        const minutes = Math.floor((timeleft / 1000) / 60);

        // Por defecto expresar en minutos
        let time = minutes;
        let unit = "minutes";

        if (minutes > 60) { // Más de una hora, expresar en horas
            time = Math.floor(time / 60);
            unit = "hours";
        }
        else if (minutes <= 0) { // Menos de un minuto, expresar en segundos
            time = Math.floor(timeleft / 1000);
            unit = "seconds";
        }


        msg.reply(messages[lang].reply.replace("{{time}}", time.toString()).replace("{{unit}}", messages[lang][unit]));
    }
}

const messages = {
    es: {
        seconds: "segundo(s)",
        minutes: "minuto(s)",
        hours: "hora(s)",
        reply: "Tu corral se reiniciará en {{time}} {{unit}}.",
    },
    en: {
        seconds: "second(s)",
        minutes: "minute(s)",
        hours: "hour(s)",
        reply: "Your corral will reset in {{time}} {{unit}}."
    }
}