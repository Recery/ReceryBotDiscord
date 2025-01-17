const fs = require("fs");
const path = require("path");

// Función recursiva
// El llamado "principal" se hace mandándole el directorio de commands
// Llama recursivamente a la funcion por cada directorio que encuentra dentro de commands
// Si dentro del directorio encuentra un archivo js (debería ser un comando), lo agrega a commandFiles para devolverlo
// Tambien se usa con el directorio interactions... y se puede usar para cualquier directorio en general al buscar archivos js

function getJSFiles(directory) {
    let files = [];

    for (const file of fs.readdirSync(directory)) {
        const fullPath = path.join(directory, file);

        if (fs.statSync(fullPath).isDirectory())
            files.push(...getCommands(fullPath));
        else if (file.endsWith(".js"))
            files.push(fullPath);
    }

    return files;
}

module.exports({
    getJSFiles
});