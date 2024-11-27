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

        ctx.font = "50px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.fillText("¡Bienvenido al server!", 300, 90)

        ctx.font = "60px Arial"
        ctx.fillStyle = "#ff7700"
        ctx.fillText(`${msg.author.username}`, 300, 170)

        const attachment = new AttachmentBuilder(canvas.toBuffer(), "avatar.png")

        msg.reply(
        {
            content: `¡Bienvenido, ${this.get_mention(msg)}!`,
            files: [attachment]
        });
    }
}

module.exports = new Bienvenida("!bienvenida", "diversion");