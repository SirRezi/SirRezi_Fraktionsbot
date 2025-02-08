const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, guildId, token } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot ist bereit! Eingeloggt als ${client.user.tag}`);

        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(token);

        try {
            console.log('Starte Registrierung der Slash-Befehle...');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log('Slash-Befehle erfolgreich registriert.');
        } catch (error) {
            console.error('Fehler beim Registrieren der Slash-Befehle:', error);
        }
    },
};
