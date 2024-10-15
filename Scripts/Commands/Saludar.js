class Saludar extends Command
{
    execution(msg)
    {
        msg.reply(`Saludos ${get_mention(msg)} pedazo de pelotudo`)
    }
}

