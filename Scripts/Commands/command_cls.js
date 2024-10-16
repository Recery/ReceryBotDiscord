
const path = require("path");

class Command
{
  constructor (init_activator)
  {
    this.activator = init_activator;
  }

  check_activation(msg)
  {
    if (msg.content === this.activator)
      this.execution(msg);
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

  execution(msg){}
}

module.exports = Command