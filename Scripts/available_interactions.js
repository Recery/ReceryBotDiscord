const fs = require("fs");
const path = require("path");   

const interactions_path = path.join(__dirname, "Interactions");
const interactions_files = fs.readdirSync(interactions_path).filter(file => file.endsWith(".js"));

const availables_interactions = [];

for (const file of interactions_files) {
    if (file != "interaction_content_cls.js" && file != "stepped_command_cls.js")
    {
        const interaction = require(`./Interactions/${file}`);
        availables_interactions.push(interaction);
    }
}

module.exports = availables_interactions;