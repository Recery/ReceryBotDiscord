const path = require("path");
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
            .setDescription("Un regalo de Senko... ¿Qué habrá dentro?")
            .setImage("attachment://Regalo.png");
        
        const regalo_path = path.join(__dirname, "../../Images/Regalo.png");

        const open_button = new Discord.ButtonBuilder()
            .setLabel("Presiona para abrir 🎁")
            .setCustomId("abrirregalo")
            .setStyle(Discord.ButtonStyle.Primary);

        const row = new Discord.ActionRowBuilder()
            .addComponents(open_button)


        msg.reply({
            embeds:[embed],
            files: [{ attachment: regalo_path, name: "Regalo.png" }],
            components: [row]
        });
    }
}



module.exports = new Regalito("!secreto", "diversion");