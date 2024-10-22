const path = require("path");
const bot_state = require(process.cwd() + "/Scripts/bot_state");
const mysql = require('mysql2/promise')

class Command
{
  constructor (init_activator)
  {
    this.activator = init_activator;
  }

  async check_activation(msg)
  {
    if (msg.content.startsWith(this.activator))
    {
      if (bot_state.get_asleep()) msg.reply("Zzz... ||Estoy dormido boludo, no puedo usar comandos||");
      else 
      {
        await this.add_command_used(msg);
        this.execution(msg);

        if (this.get_commands_used(msg) % 3 === 0 || this.get_commands_used(msg) === 1)
        {
          msg.reply("> Mi creador, además de crearme a mí, también creó un juego muy interesante... \n > Lo podés descargar gratis acá: https://recery.itch.io/slime-shoot")
        }
      }
    }
  }

  get_activator()
  {
    return this.activator;
  }

  async get_commands_used(msg)
  {
    const conex = await mysql.createConnection({
      uri: process.env.db,
      ssl: {rejectUnauthorized: false}
    });

    const [rows] = await conex.execute('SELECT * FROM commands_used');
    for (const row of rows)
    {
      if (row.mention === this.get_mention(msg))
      {
        return row.commands_used;
      }
    }

    return 0;
  }

  async add_command_used(msg)
  {
    const conex = await mysql.createConnection({
      uri: process.env.db,
      ssl: {rejectUnauthorized: false}
    });

    let id = 0;
    let amount = 1;
    let add_row = true;

    const [rows] = await conex.execute('SELECT * FROM commands_used');
    for (const row of rows)
    {
      if (row.mention === this.get_mention(msg))
      {
        id = row.id;
        await conex.execute(`UPDATE commands_used SET amount = amount + 1 WHERE id = ?`, [id]);
          
        const [updated_row] = await conex.execute('SELECT amount FROM commands_used WHERE id = ?', [id]);
        amount = updated_row[0].amount;

        add_row = false;
        break;
      }
    }

    if (add_row)
    {
      await conex.execute('INSERT INTO commands_used (mention, amount) VALUES (?, ?)', [this.get_mention(msg), amount]);
    }

    return amount;
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
    return msg.content.replace(this.get_activator(), "").trim();
  }

  execution(msg){}
}

module.exports = Command