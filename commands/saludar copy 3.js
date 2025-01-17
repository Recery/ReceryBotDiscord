module.exports = {
    name: "saludar4",
    category: "action",
    execute (client, msg, args) 
    {
        const lang = client.langs.get(msg.guildId) || "es";
        msg.reply(messages[lang].replace("{{id}}", msg.author.id));
    },
};

const messages = {
    es: "Saludos <@{{id}}> pedazo de pelotudo",
    en: "Hi <@{{id}}> piece of dumbass"
}