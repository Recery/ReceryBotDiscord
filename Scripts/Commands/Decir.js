const Command = require("./command_cls.js")

class Decir extends Command
{
    async execution(msg)
    {
        let channel = msg.channel;
        let content = this.get_content(msg);
        msg.delete();
        channel.send(content);
    }
}

module.exports = new Decir("!decir", "diversion");