const Command = require("./command_cls.js")
const Canvas = require("canvas")

class Avatar extends Command
{
    async execution(msg)
    {
        const canvas = Canvas.createCanvas(800,240);
        const ctx = canvas.getContext("2d");

        const img = await Canvas.loadImage(msg.author.avatarURL());
        ctx.drawImage(img, 50, 50, 160, 160);

        msg.reply(
        {
            content: `${this.get_mention(msg)}, tu foto de perfil: `,
            files: [{
                attachment: canvas.toBuffer(), 
                name: "avatar.png"
            }]
        });
    }
}

module.exports = new Avatar("!avatar", "diversion");