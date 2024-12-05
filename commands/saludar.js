module.exports = {
    name: "saludar",
    execute (client, msg, args) 
    {
        msg.reply(`Saludos <@${msg.author.id}> pedazo de pelotudo`);
    },
};