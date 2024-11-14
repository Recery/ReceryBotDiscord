const InteractionContent = require("./interaction_content_cls.js")

class Delete extends InteractionContent {

    async execution(interaction)
    {
        interaction.message.delete();
    }
}

module.exports = new Delete("delete")