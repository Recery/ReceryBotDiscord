const { EmbedBuilder } = require("discord.js")
const InteractionContent = require("./interaction_content_cls.js")

class AbrirRegalo extends InteractionContent {

    async execution(interaction)
    {
        let embed_respuesta = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("xd")
            .setDescription("xd")
            .setImage("attachment://DibujoDeZahira.png");
            //Feliz navidad Zahira
//Te hice un dibujo, espero que te guste"
        
        interaction.update({
            embeds:[embed_respuesta],
            files: [{ attachment: a, name: path.basename(pez.image) }]
        })
        
        
    }
}

module.exports = new AbrirRegalo("abrirregalo")