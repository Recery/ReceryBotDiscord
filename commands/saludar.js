module.exports = {
    name: "saludar",
    execute (msg, args) 
    {
        msg.reply(`Saludos <@${msg.author.id}> pedazo de pelotudo;`)
    },
};