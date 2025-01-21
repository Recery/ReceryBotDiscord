const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "corraltimeleft",
    alias: ["ctimeleft", "ctl"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const timeleft = eco.getCorralResetTimeLeft(userID);

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
            time = Math.floor(minutes * 60);
            unit = "seconds";
        }


        msg.reply(messages[lang].reply.replace("{{time}}", time.toString()).replace("{{unit}}", messages[lang][unit]));
    }
}

const messages = {
    es: {
        seconds: "segundos",
        minutes: "minutos",
        hours: "horas",
        reply: "Tu corral se reiniciará en {{time}} {{unit}}.",
    },
    en: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        reply: "Your corral will reset in {{time}} {{unit}}."
    }
}