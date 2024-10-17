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

module.exports = { 
    set_asleep,
    get_asleep
};