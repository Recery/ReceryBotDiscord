const Command = require("./command_cls.js")

class InvadirBolivia extends Command
{
    async execution(msg)
    {
        let green_apples = Math.floor(Math.random() * 5) + 1;
        await this.get_bot_state().modify_green_apples(this.get_mention(msg), green_apples);

        msg.reply(
        {
            content: `Invadiste Bolivia navegando sus vastos mares y saqueaste ${green_apples}<:ManzanaVerde:1296171434246410380>`,
            files: [this.get_gifs_directory() + "/barco.gif"]
        });
    }
}

module.exports = new InvadirBolivia("!invadirbolivia", "economia");