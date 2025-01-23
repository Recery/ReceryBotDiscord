const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "corral",
    category: "economy",
    description: {
        es: "Muestra los slimes que tienes en tu corral.\n" +
        "Cada una hora, todos los slimes se irán de tu corral.\nGanarás :green_apple: según el valor de cada slime.",
        en: "Shows all slimes from your corral.\n" +
        "Every hour, all slimes from your corral will leave.\nYou will earn :green_apple: according to the value of each slime."
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimes = eco.getCorralSlimes(userID);
        
        let content = "\n";
        if (!slimes.length > 0) content += "¡Ninguno!"
        
        for (const slime of slimes)
            content += slime.obj.displayName[lang] + " x" + slime.quantity.toString() + "\n";

        msg.reply(`<@${userID}>, tienes estos slimes en tu corral: ${content}`);
    }
}