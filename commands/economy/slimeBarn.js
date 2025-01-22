const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "slimebarn",
    alias: ["sb", "barn", "granero", "graneroslime"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimes = eco.getBarnSlimes(userID);

        let content = "\n";
        if (!slimes.length > 0) content += "¡Ninguno!"

        for (const slime of eco.getBarnSlimes(userID)) {
            content += "`ID: " + slime.obj.id.toString() + "` " // Agregar el id primero
            content += slime.obj.displayName[lang] + " x" + slime.quantity.toString() + "\n";
        }

            

        msg.reply(messages[lang] + content);
    }
}

const messages = {
    es: "Tienes estos slimes en tu granero: ",
    en: "You have these slimes in your barn: "
}