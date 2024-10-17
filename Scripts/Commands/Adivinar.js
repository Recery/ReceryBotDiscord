const Stepped_Command = require("./stepped_command_cls.js")

class Adivinar extends Stepped_Command
{
    users_numbers = [];

    execution(msg)
    {
        msg.reply("Acabé de elegir un número del 1 al 6... Ahora adivinalo (!adivinar <tu numero acá>).");
        
        this.users_numbers.push({
            mention: this.get_mention(msg),
            number: Math.floor(Math.random() * 6) + 1
        });
    }
    second_execution(msg)
    {
        var typed_number = Number(msg.content.replace("!adivinar", "").trim());
        var user_number;
        for (const user of this.users_numbers)
        {
            if (user.mention === this.get_mention(msg))
            {
                user_number = user.number;

                const index = this.users_numbers.indexOf(user);
                if (index !== -1) this.users_numbers.splice(index, 1);

                break;
            }
        }

        if (isNaN(typed_number))
        {
            msg.reply(`Sos boludo? Eso ni siquiera es un número... Ya fue, el número era ${user_number}`);
        }
        else
        {
            if (typed_number === user_number)
                msg.reply(`... Si, ${user_number} era el número, como adivinaste?`);
            else
                msg.reply(`JAJAJAJAJAJA ESE NO ERA, MI NÚMERO ES ${user_number}`);
        }
    }
}

module.exports = new Adivinar("!adivinar");