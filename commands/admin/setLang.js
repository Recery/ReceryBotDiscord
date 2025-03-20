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
    syntax: {
        es: "{{prefix}}setlang <idioma>",
        en: "{{prefix}}setlang <language>"
    },
    execute(client, msg, args)
    {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!msg.member.permissions.has("Administrator")) {
            msg.reply(messages[lang].noPermissions);
            return;
        }

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

        Langs.setLang(client, serverid, new_lang);

        msg.reply(messages[new_lang].success.replace("{{lang}}", new_lang));
    }
}

const messages = {
    es: {
        noPermissions: "No tienes los permisos necesarios para cambiarme el idioma en este servidor.",
        invalidLang: "Debes ingresar un idioma válido.",
        success: "El idioma fue cambiado a `{{lang}}` con éxito."
    },
    en: {
        noPermissions: "You don't have enough permissions to change my language in this server.",
        invalidLang: "You must enter a valid language.",
        success: "Language has been changed to `{{lang}}` succesfully."
    }
}