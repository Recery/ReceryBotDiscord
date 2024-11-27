const { AttachmentBuilder, EmbedBuilder } = require("discord.js")
const DB = require("better-sqlite3");
const Canvas = require("canvas");

function get_welcomes_settings()
{
    const db = new DB(process.env.ADMIN_DB_PATH)
    return db.prepare("SELECT * FROM welcomes").all();;
}

function check_welcomes(member, client)
{
    for (const setting of get_welcomes_settings())
    {
        if (setting.serverid === member.guild.id)
        {
            execute_welcome(setting, member);
            return;
        }
    }
}

async function execute_welcome(setting, member)
{
	const canvas = Canvas.createCanvas(800,240);
	const ctx = canvas.getContext("2d");

	const background = await Canvas.loadImage(setting.imgsrc)
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

	const img = await Canvas.loadImage(
		member.displayAvatarURL({extension: "png", size: 1024})
	);
	ctx.drawImage(img, 40, 40, 160, 160);

	ctx.font = '50px "Arial"'
	ctx.fillStyle = "#ffffff"
	ctx.fillText(setting.imgmsg, 260, 90)

	ctx.font = '60px "Arial"'
	ctx.fillStyle = "#ff7700"
	ctx.fillText(`${member.user.username}`, 300, 170)

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: "bienvenidarecery.png"})

    console.log(setting.embedmsg)
    const embed = new EmbedBuilder()
        .setColor("#65a7fc")
        .setThumbnail(member.displayAvatarURL({extension: "png", size: 1024}))
        .setTitle(`¡Bienvenid@ ${member.user.username} al Estanque de Recery!`)
        .setDescription(setting.embedmsg)
        .setImage("attachment://bienvenidarecery.png")

	member.guild.channels.cache.get(setting.channelid).send({
        embeds: [embed],
        files: [attachment]
    })
}

module.exports = 
{
    check_welcomes
}