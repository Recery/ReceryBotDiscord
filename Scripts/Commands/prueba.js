const Command = require("./command_cls.js")
const Canvas = require("canvas")
const { AttachmentBuilder, EmbedBuilder } = require("discord.js")


class prueba extends Command
{
    async execution(msg)
    {
        const canvas = Canvas.createCanvas(800,240);
        const ctx = canvas.getContext("2d");
    
        const background = await Canvas.loadImage("https://i.imgur.com/R5z3Xn9.jpeg")
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    
        ctx.font = '50px "Arial"'
        ctx.fillStyle = "#ffffff"
        ctx.fillText("setting.message", 260, 90)
    
        ctx.font = '60px "Arial"'
        ctx.fillStyle = "#ff7700"
        ctx.fillText(`qwddwqdwq`, 300, 170)
    
        const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: "bienvenidarecery.png"})
    
        const embed = new EmbedBuilder()
            .setTitle(`¡Bienvenid@ qwdfdfwq al Estanque de Recery!`)
            .setDescription(`<:ReceryBot:1311098123191455784>¡Ha nacido un alevin!<:ReceryBot:1311098123191455784>
                Bienvenido al estanque, pequeño pez.
                Aquí puedes hacer muchas cosas acuáticas como:
                - Hablar con otros peces del cardumen en<a:Flechita:1311181180653142129> <#1311068785737990307>\n
                - Obtener tu rol de color en<a:Flechita:1311181180653142129> <#1311095086716682372>\n
                - Mostrar tus dibujos y arte en<a:Flechita:1311181180653142129> <#1311075810953662474>\n
                - Interactuar con nuestro asistente pez robótico en<a:Flechita:1311181180653142129> <#1311077612961140747>\n
                ¡Que nades bien!`)
            .setImage("attachment://bienvenidarecery.png")
        
        msg.reply(
            {
                embeds: [embed],
                files: [attachment]
            }
        )
    }
}

module.exports = new prueba("!abcd", "diversion");