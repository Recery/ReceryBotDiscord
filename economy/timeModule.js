

// Enviar tiempo en milisegundos
function getTimeMinimumExpressedUnit(time) {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return {time: hours, unit: "hours"};
    else if (minutes > 0) return {time: minutes, unit: "minutes"};
    return {time: seconds, unit: "seconds"};
}

const units = {
    es: {
        seconds: "Segundo(s)",
        minutes: "Minutos(s)",
        hours: "Hora(s)"
    },
    en: {
        seconds: "Second(s)",
        minutes: "Minute(s)",
        hours: "Hour(s)"
    }
}

module.exports = {
    getTimeMinimumExpressedUnit,
    units
}