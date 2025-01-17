module.exports = {
    name: "saludar",
    category: "action",
    execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";
        msg.reply(messages[lang].replace("{{id}}", msg.author.id));
    },
};

const messages = {
    es: "¡Saludos, <@{{id}}>! ¿Cómo estás?",
    en: "Hi, <@{{id}}>! How are you doing?"
}