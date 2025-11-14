const Discord = require("discord.js");
const util = require("util");
const execution = util.promisify(require("child_process").exec);
const fs = require("fs/promises");

const ttsVoices = {
    es1: "spanish-mbrola-1",
    es2: "spanish-mbrola-2",
    en1: "english-mb-en1"
};

module.exports = {
    name: "tts",
    category: "fun",
    description: {
        es: "Enviás texto, y lo convierto en un archivo de audio.\n" + 
        "Admite un máximo de 1000 caracteres.\n\n" +
        "Puedes elegir entre las siguientes voces (es2 por defecto): \n`" + Object.keys(ttsVoices).join("` `") + "`\n" +
        "Para aplicar una voz, usa -v e indica la voz delante. Consulta los ejemplos debajo.\n\n" +
        "También puedes cambiar la velocidad. Admite una velocidad de 1 a 30 (5 por defecto).\n" +
        "Para aplicar una velocidad, usa -s e indica la velocidad delante. Consulta los ejemplos debajo.\n",
        en: "You send text, and I convert it to an audio file.\n" +
        "Up to 1000 characters.\n\n" +
        "You can choose between the following voices (es2 by default): \n`" + Object.keys(ttsVoices).join("` `") + "`\n" +
        "To use a voice, add -v and indicate the voice next. See examples below.\n\n" +
        "You can also change the speed. The speed range goes from 1 to 30 (5 by default).\n" +
        "To use custom speed, add -s and indicate the speed next. See examples below.\n"
    },
    syntax: {
        es: "{{prefix}}tts [voz] [velocidad] <mensaje>",
        en: "{{prefix}}tts [voice] [speed] <message>"
    },
    examples: [
        "{{prefix}}tts Hello world",
        "{{prefix}}tts -s 25 I eat food from the floor",
        "{{prefix}}tts -v en1 -s 10 Becoming potatoes",
        "{{prefix}}tts -v es2 Un elefante se balanceaba...",
        "{{prefix}}tts -s 2 -v es1 ...¡Sobre la tela de una araña!"
    ],
    async execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (args.length < 1) {
            msg.reply(messages[lang].emptyMessage);
            return;
        }

        let ttsVoice = "spanish-mbrola-2";
        let ttsSpeed = 175;

        let paramsCheck = new Map();
        paramsCheck.set("-v", false);
        paramsCheck.set("-s", false);

        let argsToRemove = [];
        const keys = Object.keys(ttsVoices);
        for (const arg of args) {
            let isParamKey = false;
            switch(arg) {
                case "-v": 
                    paramsCheck.set("-v", true);
                    isParamKey = true;
                    break;
                case "-s":
                    paramsCheck.set("-s", true);
                    isParamKey = true;
                    break;
            }

            if (isParamKey) {
                argsToRemove.push(arg);
                continue;
            }

            for (const key of paramsCheck.keys()) {
                if (paramsCheck.get(key)) {
                    switch(key) {
                        case "-v":
                            if (keys.includes(arg)) {
                                ttsVoice = ttsVoices[arg];
                                argsToRemove.push(arg);
                            }
                            break;
                        case "-s":
                            if (!isNaN(Number(arg)) && Number(arg) > 0) {
                                ttsSpeed = 25 + (Number(arg) * 25);
                                if (ttsSpeed > 775) ttsSpeed = 775;

                                argsToRemove.push(arg);
                            }
                            break;
                    }
                }
            }
        }

        let text = "";

        for (const arg of args) {
            if (!argsToRemove.includes(arg)) text += arg + " ";
        }

        text = text.trim();

        const sanitizedText = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ.,;:!?¡¿'"()\s-]/g, "");

        if (sanitizedText.length > 1000) {
            msg.reply(messages[lang].tooMuchChars);
            return;
        }

        try {
            const filePath = process.env.TMP_DIR + msg.id + ".ogg";

            await execution(`espeak -v${ttsVoice} -w ${filePath} -s ${ttsSpeed} "${sanitizedText}"`);

            const attachment = new Discord.AttachmentBuilder(filePath, { name: "ReceryBotAudio.ogg" });

            
            await msg.reply({
                content: messages[lang].reply,
                files: [attachment]
            });

            await fs.unlink(filePath);
        } catch(err) {
            console.log("Hubo este error:", err);
            msg.reply(messages[lang].err);
        }
    }
}

const messages = {
    es: {
        emptyMessage: "Debes enviar texto para que lo convierta a audio.",
        reply: "Aquí está tu archivo de audio.",
        tooMuchChars: "Excediste el límite de caracteres. Envía menos.",
        err: "Hubo un error al generar el audio."
    },
    en: {
        emptyMessage: "You must send text to convert it to audio.",
        reply: "Here's your audio file.",
        tooMuchChars: "You exceeded the characters limit. Please shorten your text.",
        err: "There has been an error generating the audio file."
    }
}