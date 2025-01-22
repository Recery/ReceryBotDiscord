const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
    name: "tts",
    category: "fun",
    description: {
        es: "Ingresa un texto, y yo te envío un audio diciéndolo.",
        en: "Enter a text, and I will send an audio saying it."
    },
    async execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (args.length < 1) {
            msg.reply(messages[lang])
            return;
        }

        const text = args.join(" ");

        try {
            const ttsURL = `https://ttsmp3.com/makemp3_new.php`;
            const body = new URLSearchParams({
                msg: text,
                lang: "Conchita",
                source:"ttsmp3"
            });
            
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
    
            const attachment = new Discord.AttachmentBuilder(file_path, {name: "AudioReceryBot.mp3"});
            await msg.reply({files: [attachment]});
    
            fs.unlinkSync(file_path);
        }
        catch (err) {
            console.log("Hubo este error:", err);
        }
    },
};

const messages = {
    es: "Debes ingresar un texto para decir.",
    en: "You must enter a text to say."
}