class InteractionContent {
    
    constructor(init_id)
    {
        this.id = init_id;
    }

    check_activation(id)
    {
        return this.id === id;
    }

    execution(interaction){}
}

module.exports = InteractionContent