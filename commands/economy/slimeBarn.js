const eco = require("../../economy/economyModule.js");

module.exports = {
    name: "slimebarn",
    alias: ["sb", "barn", "granero", "graneroslime"],
    category: "economy",
    execute(client, msg, args) {
        const userID = msg.author.id;

        msg.reply(`<@${userID}>, en total tienes ${eco.getBarnSlimesAmount(userID)}`);
    }
}