// Todo lo de si el bot está dormido
let asleep = false 
function set_asleep(new_state)
{
    asleep = new_state;
}
function get_asleep()
{
    return asleep;
}
// ------- //

// Este array guarda diccionarios que contienen un comando y el usuario que lo activo
// Cuando se vuelve a activar ese comando por el usuario, elimina el diccionario correspondiente del array
// Sirve para comandos que tienen "doble interaccion"
let active_commands = []

function add_active_command(new_active_command)
{
    active_commands.push(new_active_command);
}

function remove_action_command(command_to_remove)
{
    if (!active_commands.includes(command_to_remove)) return;

    const index = active_commands.indexOf(command_to_remove)
    if (index !== -1) active_commands.splice(index, 1);
}

module.exports = { 
    set_asleep,
    get_asleep
};