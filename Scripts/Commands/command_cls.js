const path = require("path");
const bot_state = require(process.cwd() + "/Scripts/bot_state");

class Command
{
  constructor (init_activator)
  {
    this.activator = init_activator;
  }

  check_activation(msg)
  {
    if (msg.content.startsWith(this.activator))
    {
      if (bot_state.get_asleep()) msg.reply("Zzz... ||Estoy dormido boludo, no puedo usar comandos||");
      else this.execution(msg);
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

  get_bot_state()
  {
    return bot_state;
  }

  get_content(msg)
  {
    msg.content.replace(this.get_activator(), "").trim();
  }

  execution(msg){}
}

module.exports = Command