const Command = require("./command_cls.js");
const Discord = require("discord.js");

class Regalito extends Command
{
    execution(msg)
    {
        if (/*msg.author.id !== "1296846133489963049" && */msg.author.id !== "1069155273182285834") 
        {
            msg.reply("Usuario no autorizado.");
            return;
        }

        const embed = new Discord.EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Regalo")
            .setDescription("Este es un regalo");

        const hit_button = new Discord.ButtonBuilder()
            .setLabel("🎁 Golpes restantes: 1")
            .setCustomId("golpearregalo")
            .setStyle(Discord.ButtonStyle.Primary);

        const row = new Discord.ActionRowBuilder()
            .addComponents(hit_button)


        msg.reply({embeds:[embed], components: [row]});
    }
}



module.exports = new Regalito("!secreto", "diversion");