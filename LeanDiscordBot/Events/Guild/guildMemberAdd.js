const {EmbedBuilder, GuildMember, Embed} = require('discord.js')
const Schema = require('../../Models/Welcome');

module.exports = {
    once: false,
    name: 'guildMemberAdd',
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}).then((data) => {
            if (!data) return;
            let Channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;

            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(Channel);

            const welcomeEmbed = new EmbedBuilder()
            .setTitle("**New member!**")
            .setDescription(Msg)
            .setColor(0x037821)
            .addFields({name: 'Total members', value: `${guild.memberCount}`})
            .setTimestamp();

            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(Role);
        })
    }
};