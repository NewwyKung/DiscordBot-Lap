const { CommandInteraction } = require('discord.js')

module.exports = {
    once: false,
    name: 'interactionCreate',
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            interaction.reply({content: "outdated commnad"});
        };

        command.execute(interaction, client);
    },
};