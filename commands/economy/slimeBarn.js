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

        for (const slime of eco.getBarnSlimes(userID))
            content += slime.slime.displayName[lang] + " x" + slime.amount.toString();

        msg.reply(`<@${userID}>, en tienes estos slimes en tu granero: ${content}`);
    }
}