const {Client} = require('discord.js');
const config = require('../../config.json')
const { default: mongoose } = require('mongoose');

module.exports = {
    once: true,
    name: 'ready',
    async execute(client) {
        await mongoose.connect(config.mongoConnect || '')

        if (mongoose.connect) {
            console.log('[Discord Conlose]: DataBase success to connect !!')
        }else{
            console.log('[Discord Conlose]: DataBase fail to connect !!')
        }
        
        console.log(`[Discord Conlose]: ${client.user.username} is now Online !`);
    }
};