const eco = require("../../economy/economyModule.js");
const slimes = require("../../economy/slimes.js");

module.exports = {
    name: "addtobarn",
    alias: ["addb"],
    category: "economy",
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";
        const userID = msg.author.id;

        const slimeRef = args[0];
        if (!slimeRef) {
            msg.reply("Debes ingresar el nombre/ID del slime que deseas agregar al granero.");
            return;
        }

        const slime = slimes.getSlime(slimeRef) || slimes.getSlimeByName(slimeRef);

        if (!slime) {
            msg.reply("No se ha encontrado un slime con ese nombre/ID.");
            return;
        }

        eco.addSlimeToBarn(userID, slime.id);
        msg.reply(`El ${slime.displayName[lang]} ha sido añadido a tu granero.`);
    }
}

