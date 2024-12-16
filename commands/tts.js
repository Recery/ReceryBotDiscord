const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
    name: "tts",
    async execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        try {
            const ttsURL = `https://api.freetts.com/generate?lang=es-ES&voice=es-MX-Standard-A&text=${encodeURIComponent("hola mundo")}`;
            const response = await fetch(ttsURL);
            const buffer = await response.buffer();
    
            const file_path = "tts_output.mp3";
            fs.writeFileSync(file_path, buffer);
    
            const attachment = new Discord.AttachmentBuilder(file_path, {name: "tts_output.mp3"});
    
    
            await msg.reply({files: [attachment]});
    
            fs.unlinkSync(file_path);
        }
        catch (err) {
            console.log("Hubo este error:", err);
        }
    },
};

const messages = {
    es: "Saludos usuario pedazo de pelotudo",
    en: "Hi user piece of dumbass"
}