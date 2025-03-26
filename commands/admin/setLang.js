const Langs = require("../../langsLoader.js");

// La key es como se llama "oficialmente" al idioma
// El array dentro de la propiedad son los posibles alias para referirse al idioma
const availableLangs = {
    es: ["es", "español", "spanish"],
    en: ["en", "ingles", "inglés", "english"]
}
const keys = Object.keys(availableLangs);

const messages = {
    es: {
        noPermissions: "No tienes los permisos necesarios para cambiarme el idioma en este servidor.",
        invalidLang: "Debes ingresar un idioma válido.",
        success: "El idioma fue cambiado a `{{lang}}` con éxito.",
        langs: "Idiomas disponibles: " + "`" + keys.join("` `").trim() + "`"
    },
    en: {
        noPermissions: "You don't have enough permissions to change my language in this server.",
        invalidLang: "You must enter a valid language.",
        success: "Language has been changed to `{{lang}}` succesfully.",
        langs: "Available langs: " + "`" + keys.join("` `").trim() + "`"
    }
}

module.exports = {
    name: "setlang",
    category: "administration",
    description: {
        es: "Cambia el idioma del servidor.\n" + messages["es"].langs,
        en: "Changes server language.\n" + messages["en"].langs
    },
    examples: ["{{prefix}}setlang es", "{{prefix}}setlang en"],
    syntax: {
        es: "{{prefix}}setlang <idioma>",
        en: "{{prefix}}setlang <language>"
    },
    execute(client, msg, args) {
        const lang = client.langs.get(msg.guildId) || "es";

        if (!msg.member.permissions.has("Administrator")) {
            msg.reply(messages[lang].noPermissions);
            return;
        }

        if (!args.length > 0) {
            msg.reply(`${messages[lang].invalidLang}\n${messages[lang].langs}`);
            return;
        }

        let newLang;
        for (const key of keys) {
            if (availableLangs[key].includes(args[0])) {
                newLang = key;
                break;
            }
        }

        if (!newLang) {
            msg.reply(`${messages[lang].invalidLang}\n${messages[lang].langs}`);
            return;
        }

        const serverId = msg.guildId;

        Langs.setLang(client, serverId, newLang);

        msg.reply(messages[newLang].success.replace("{{lang}}", newLang));
    }
}