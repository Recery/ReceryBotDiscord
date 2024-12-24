const path = require("path");
const { EmbedBuilder } = require("discord.js");
const InteractionContent = require("./interaction_content_cls.js");

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
        const dibujo_path = path.join(__dirname, "../../Images/ManzanaVerde.png");
        
        interaction.update({
            embeds:[embed_respuesta],
            files: [{ attachment: dibujo_path, name: "DibujoDeZahira.png" }]
        })
    }
}

module.exports = new AbrirRegalo("abrirregalo")