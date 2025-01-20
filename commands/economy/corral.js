const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "corral",
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimes = eco.getCorralSlimes(userID);
        
        let content = "\n";
        if (!slimes.length > 0) content += "¡Ninguno!"
        
        for (const slime of slimes)
            content += slime.slime.displayName[lang] + " x" + slime.quantity.toString() + "\n";

        msg.reply(`<@${userID}>, tienes estos slimes en tu corral: ${content}`);
    }
}