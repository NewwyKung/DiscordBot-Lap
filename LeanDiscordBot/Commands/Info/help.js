const { ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of all the commands form discord bot'),
    async execute(interaction) {
        const emojis = {
            info: "🧙‍♂️",
            moderation: "🧙‍♀️",
            public: "🧟‍♂️",
        };

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder))
        ];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = await directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "There is no description"
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands
            };
        });
        
        const embed = new EmbedBuilder()
            .setDescription("Please choose a categorty in the dropdown menu");

        const components = (state) => [
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("help-menu")
                        .setPlaceholder("Please selcet a categorty")
                        .setDisabled(state)
                        .addOptions(
                            categories.map((cmd) => {
                                return {
                                    label: cmd.directory,
                                    value: cmd.directory.toLowerCase(),
                                    description: `Commands from ${cmd.directory} categorty`,
                                    emoji: emojis[cmd.directory.toLowerCase() || null]
                                };
                            })
                        )
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;
        
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu
        });

        collector.on("collect", (interaction) => {


            const [directory] = interaction.values;
            const categorty = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categortyEmbed = new EmbedBuilder()
                .setTitle(`${formatString(directory)} commands`)
                .setDescription(`A list of all commands categorized under ${directory}`)
                .addFields(
                    categorty.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true
                        };
                    })
                );

            interaction.update({ embeds: [categortyEmbed] });
        });

        collector.on("end", () => {
            initialMessage.edit({ components: components(true) });
        });
    },
};