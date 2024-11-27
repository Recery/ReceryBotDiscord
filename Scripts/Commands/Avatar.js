const Command = require("./command_cls.js")
const Canvas = require("canvas")
const { AttachmentBuilder } = require("discord.js");

class Bienvenida extends Command
{
    async execution(msg)
    {
        const canvas = Canvas.createCanvas(800,240);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("https://i.imgur.com/R5z3Xn9.jpeg")
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        const img = await Canvas.loadImage(
            msg.author.displayAvatarURL({extension: "png", size: 128})
        );
        ctx.drawImage(img, 50, 50, 160, 160);

        ctx.font = "30px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.fillText("¡Bienvenido al server!", 400, 75)

        ctx.font = "40px Arial"
        ctx.fillStyle = "#4a65ff"
        ctx.fillText(`${msg.author.username}`, 400, 125)

        const attachment = new AttachmentBuilder(canvas.toBuffer(), "avatar.png")

        msg.reply(
        {
            content: `${this.get_mention(msg)}, tu foto de perfil: `,
            files: [attachment]
        });
    }
}

module.exports = new Bienvenida("!bienvenida", "diversion");