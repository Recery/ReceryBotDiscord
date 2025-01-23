const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "cycletimeleft",
    alias: ["ctimeleft", "ctl"],
    category: "economy",
    description: {
        es: "Muestra el tiempo restante para completar un ciclo. Después de cada ciclo:\n" +
        "Slimes de tu granero generarán :green_apple: y los de tu corral se irán.",
        en: "Show the time left to complete a cycle. After each cycle:\n" +
        "Slimes from your barn will generate :green_apple: y the ones from your corral will leave."
    },
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
        reply: "Tu ciclo se completará en {{time}} {{unit}}.",
    },
    en: {
        seconds: "second(s)",
        minutes: "minute(s)",
        hours: "hour(s)",
        reply: "Your cycle will be completed in {{time}} {{unit}}."
    }
}