const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
    name: "tts",
    async execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        try {
            const ttsURL = `https://ttsmp3.com/makemp3_new.php`;
            const body = new URLSearchParams({
                msg: "Hola mundo",
                lang: "Joanna",
                source:"ttsmp3"
            });


            /*if (!response.ok)
            {
                console.log("Mala respuesta: ", response);
                console.log("URL generada: ", ttsURL);
                return;
            }*/
            
            const response = await fetch(ttsURL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded"},
                body: body
            })

            const json = await response.json();

            const audioResponse = await fetch(json.URL);
            const buffer = await audioResponse.buffer();

            if (buffer.length === 0) {
                console.log("Archivo vacio");
                return;
            }
    
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