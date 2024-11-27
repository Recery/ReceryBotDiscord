const Command = require("./command_cls.js")
const Canvas = require("canvas")
const { MessageAttachment } = require("discord.js");

class Avatar extends Command
{
    async execution(msg)
    {
        const canvas = Canvas.createCanvas(800,240);
        const ctx = canvas.getContext("2d");

        const img = await Canvas.loadImage(
            msg.author.displayAvatarURL({size: 1024, dynamic: true, format: "png"})
        );
        ctx.drawImage(img, 50, 50, 160, 160);

        const attachment = new MessageAttachment(canvas.toBuffer(), "avatar.png")

        msg.reply(
        {
            content: `${this.get_mention(msg)}, tu foto de perfil: `,
            files: [attachment]
        });
    }
}

module.exports = new Avatar("!avatar", "diversion");