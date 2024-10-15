const fs = require("fs");
const path = require("path");   

const commands_path = path.join(__dirname, "Commands");
const command_files = fs.readdirSync(commands_path).filter(file => file.endsWith(".js"));

const availables_commands = [];

for (const file of command_files) {
    if (file != "command_cls.js")
    {   
        const command = require(`./Commands/${file}`);
        availables_commands.push(command);
    }
}

module.exports = availables_commands;