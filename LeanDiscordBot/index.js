const config = require('./config.json')
const { Client, Collection, EmbedBuilder } = require('discord.js');
const { loadEvent } = require('./Handlers/eventHandler.js');
const { loadCommand } = require('./Handlers/commandHandler.js');
const client = new Client({
intents: [
    'Guilds',
    'GuildMessages',
    'GuildMembers'
]});
client.on('error', (err) => {
    console.log(err.message)
});
const commands = [];
client.commands = new Collection();

client.login(config.token).then(() => {
    loadEvent(client);
    loadCommand(client);
})