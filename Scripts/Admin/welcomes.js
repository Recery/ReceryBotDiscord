const DB = require("better-sqlite3");
const Canvas = require("canvas");

function get_welcomes_settings()
{
    const db = new DB(process.env.ADMIN_DB_PATH)

    let rows = db.prepare("SELECT * FROM welcomes").all();

    const welcomes_settings = [];

    for (const row of rows)
    {
        console.log(row)
        welcomes_settings.push({
            id: row.id, 
            serverid: row.serverid, 
            channelid: row.channelid,
            imgsrc: row.imgsrc,
            message: row.message
        })
    }

    return welcomes_settings;
}

function check_welcomes(member)
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

	const background = await Canvas.loadImage("https://i.imgur.com/R5z3Xn9.jpeg")
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

	const img = await Canvas.loadImage(
		member.displayAvatarURL({extension: "png", size: 1024})
	);
	ctx.drawImage(img, 40, 40, 160, 160);

	ctx.font = '50px "Arial"'
	ctx.fillStyle = "#ffffff"
	ctx.fillText("¡Bienvenido al server!", 260, 90)

	ctx.font = '60px "Arial"'
	ctx.fillStyle = "#ff7700"
	ctx.fillText(`${member.user.username}`, 300, 170)

	const attachment = new AttachmentBuilder(canvas.toBuffer(), "avatar.png")

	client.channels.cache.get(setting.channelid).send({files:[attachment]})
}

module.exports = 
{
    check_welcomes
}
