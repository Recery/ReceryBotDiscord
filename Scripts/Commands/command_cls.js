const path = require("path");

class Command
{
    constructor (init_activator, init_category = "otros")
    {
        this.activator = init_activator;
        this.category = init_category;
    }

    async check_activation(msg)
    {
        const command_content = msg.content.replace(/\s+/g, '').toLowerCase();

        if (command_content.startsWith(this.activator.toLowerCase()))
        this.execution(msg);
    }

    set_client(new_client)
    {
        this.client = new_client;
    }

    async get_username(id, msg)
    {
        try
        {
            const user = await msg.guild.members.fetch(id);
            const display_name = user.nickname;
            return display_name;
        }
        catch (error)
        {
            console.error("No se pudo obtener el usuario.");
            return "Usuario no válido";
        }
    }

    get_activator()
    {
        return this.activator;
    }

    get_image_directory()
    {
        return path.join(__dirname, '../../Images')
    }

    get_gifs_directory()
    {
        return path.join(__dirname, '../../Gifs')
    }

    get_mention(msg)
    {
        return `<@${msg.author.id}>`;
    }

    get_content(msg)
    {
        return msg.content.replace(this.get_activator(), "").trim();
    }

	execution(msg){}
}


module.exports = Command