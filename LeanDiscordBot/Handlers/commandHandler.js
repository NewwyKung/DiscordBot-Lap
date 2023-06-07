function loadCommand(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading('Commands','Status');

    let commandsArray = [];

    const commandsFolder = fs.readdirSync('./Commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);

            if ('data' in commandFile && 'execute' in commandFile) {
                const properties = {folder, ...commandFile};
                client.commands.set(commandFile.data.name, properties);
                commandsArray.push(commandFile.data.toJSON());
                table.addRow(file, "loaded");
            } else {
                table.addRow(file, "fail");
            }
            continue;
        }
    }

    client.application.commands.set(commandsArray);
    console.log('[Discord Conlose]: Load Commmands !\n', table.toString());
    return
};

module.exports = {loadCommand};