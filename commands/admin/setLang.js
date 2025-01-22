const Langs = require("../../langsLoader.js");

const availableLangs = ["es", "en"];
module.exports = {
    name: "setlang",
    category: "administration",
    description: {
        es: "Cambia el idioma del servidor.\nIdiomas disponibles: " + "`" + availableLangs.join("` `").trim() + "`",
        en: "Changes server language.\nAvailables langs: " + "`" + availableLangs.join("` `").trim() + "`"
    },
    examples: ["{{prefix}}setlang es", "{{prefix}}setlang en"],
    execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!args.length > 0) {
            msg.reply(messages[lang].invalidLang);
            return;
        }
        else if (!availableLangs.includes(args[0])) {
            msg.reply(messages[lang].invalidLang);
            return;
        }

        const serverid = msg.guildId;
        const new_lang = args[0];

        Langs.set_lang(client, serverid, new_lang);

        msg.reply(messages[new_lang].success.replace("{{lang}}", new_lang));
    }
}

const messages = {
    es: {
        invalidLang: "Debes ingresar un idioma válido.",
        success: "El idioma fue cambiado a `{{lang}}` con éxito."
    },
    en: {
        invalidLang: "You must enter a valid language.",
        success: "Language has been changed to `{{lang}}` succesfully."
    }
}