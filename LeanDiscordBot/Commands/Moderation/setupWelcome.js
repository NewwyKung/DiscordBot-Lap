const { Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const welcomeSchema = require('../../Models/Welcome.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName('setupwelcome')
    .setDescription('Setup Welcome Message')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Channel for welcome message")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("welcome-message")
        .setDescription("Enter Your welcome message")
        .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName("welcome-role")
        .setDescription("Enter your welcome role")
        .setRequired(true)
    ),
async execute(interaction) {
    const {channel, options} = interaction;
    
    const welcomeChannel = options.getChannel("channel");
    const welcomeMessage = options.getString("welcome-message");
    const roleId = options.getRole("welcome-role")

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
        interaction.reply({content: "I don't have permissions for this", ephemeral: true});
    };

    welcomeSchema.findOne({Guild: interaction.guild.id}).then( async (data) => {
        if (!data) {
            const newWelcome = await welcomeSchema.create({
                Guild: interaction.guild.id,
                Channel: welcomeChannel.id,
                Msg: welcomeMessage,
                Role: roleId.id
            });
        };
        interaction.reply({content: "Succesfully "})
    })
    }
};