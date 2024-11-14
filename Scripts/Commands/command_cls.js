const path = require("path");
const bot_state = require(process.cwd() + "/Scripts/bot_state");
const mysql = require('mysql2/promise')

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
    {
      if (bot_state.get_asleep()) msg.reply("Zzz... ||Estoy dormido boludo, no puedo usar comandos||");
      else 
      {
        let commands_used = await this.add_command_used(msg);
        this.execution(msg);

        if (commands_used % 50 === 0)
        {
          msg.reply("> Mi creador, además de crearme a mí, también creó un juego muy interesante... \n > Lo podés descargar gratis acá: https://recery.itch.io/slime-shoot")
        }
      }
    }
  }

  set_client(new_client)
  {
    this.client = new_client;
  }

  async get_username(id, msg)
  {
    console.log(id)

    try
    {
      const user = await msg.guild.members.fetch(id);
      const display_name = user.nickname || user.user.username;
      return display_name;
    }
    catch (error)
    {
      console.error("No se pudo obtener el usuario.");
      return "Usuario no válido.";
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
        return row.amount;
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
