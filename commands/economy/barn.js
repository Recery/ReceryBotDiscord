const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "barn",
    alias: ["granero"],
    category: "economy",
    description: {
        es: "Muestra los slimes que tienes en tu granero.\n" +
        "Puedes añadir o quitar slimes del granero con `addbarn` y `removeb` respectivamente.",
        en: "Shows the slimes you have in your barn.\n" + 
        "You can add or remove slimes from your barn with `addbarn` and `removeb` respectively."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimes = eco.getBarnSlimes(userID);

        let content = "\n";
        if (!slimes.length > 0) content += "¡Ninguno!";

        for (const slime of eco.getBarnSlimes(userID)) {
            content += "`ID: " + slime.obj.id.toString() + "` " // Agregar el id primero
            content += slime.obj.displayName[lang] + " x" + slime.quantity.toString() + "\n";
        }

        msg.reply(messages[lang].slimesInBarn + content + messages[lang].appleGeneration.replace("{{apples}}", eco.getBarnApplesGeneration(userID)));
    }
}

const messages = {
    es: {
        slimesInBarn: "Tienes estos slimes en tu granero: ",
        appleGeneration: "Tu generación de :green_apple: es de {{apples}} por hora."
    },
    en: {
        slimesInBarn: "You have these slimes in your barn: ",
        appleGeneration: "Your :green_apple: generation is of {{apples}} per hour."
    }
}