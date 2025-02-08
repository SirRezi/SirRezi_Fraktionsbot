const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { FRAKVERWALTUNG_ROLE_ID } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fraktion')
        .setDescription('Verwaltet Fraktionsbefehle.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('offiziell')
                .setDescription('Macht eine Fraktion offiziell.')
                .addUserOption(option =>
                    option
                        .setName('leitung')
                        .setDescription('Die Leitung der Fraktion.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('fraktion')
                        .setDescription('Die Fraktion, die offiziell gemacht werden soll.')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option
                        .setName('kanal')
                        .setDescription('Der Kanal, in dem die Ankündigung gesendet wird.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('warnung')
                .setDescription('Verwarnt eine Fraktion.')
                .addStringOption(option =>
                    option
                        .setName('fraktion')
                        .setDescription('Die Fraktion, die gewarnt wird.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('warnung')
                        .setDescription('Die Anzahl der aktiven Warnungen der Fraktion.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('grund')
                        .setDescription('Der Grund der Warnung.')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option
                        .setName('kanal')
                        .setDescription('Der Kanal, in dem die Warnung gepostet werden soll')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('discord')
                .setDescription('Fügt den Discord-Server-Link der Fraktion hinzu.')
                .addStringOption(option =>
                    option
                        .setName('fraktion')
                        .setDescription('Die Fraktion, für die der Discord-Server hinzugefügt werden soll.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('discord')
                        .setDescription('Der Discord-Server-Link der Fraktion.')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option
                        .setName('kanal')
                        .setDescription('Der Kanal, in dem der Discord-Link gepostet werden soll.')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(FRAKVERWALTUNG_ROLE_ID)) {
            return interaction.reply({
                content: 'Du hast keine Berechtigung, diesen Befehl auszuführen!',
                ephemeral: true,
            });
        }

        if (interaction.options.getSubcommand() === 'offiziell') {
            const leitung = interaction.options.getUser('leitung');
            const fraktion = interaction.options.getString('fraktion');
            const kanal = interaction.options.getChannel('kanal');

            const embed = new EmbedBuilder()
                .setColor('#4E9CAF')
                .setTitle('» **Fraktion Offiziell**')
                .setDescription(`
                    Hiermit ist die Fraktion **"${fraktion}"** unter der Leitung von <@${leitung.id}> offiziell.

                    **Probezeit**: 14 Tage  
                    **Aufbauschutz**: 3 Tage  

                    Mit freundlichen Grüßen,  
                    **Fraktionsleitung**
                `)
                .setTimestamp()
                .setFooter({
                    text: 'Fraktionsverwaltung',
                });

            try {
                await kanal.send({ embeds: [embed] });
                await interaction.reply({
                    content: 'Die Ankündigung wurde erfolgreich gesendet!',
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Fehler beim Senden der Nachricht:', error);
                interaction.reply({
                    content: 'Es gab einen Fehler beim Senden der Ankündigung.',
                    ephemeral: true,
                });
            }
        } else if (interaction.options.getSubcommand() === 'warnung') {
            const fraktion = interaction.options.getString('fraktion');
            const warnung = interaction.options.getInteger('warnung');
            const grund = interaction.options.getString('grund');
            const kanal = interaction.options.getChannel('kanal');

            const embed = new EmbedBuilder()
                .setColor('#FF8C00')
                .setTitle('» **Fraktion Warnung**')
                .setDescription(`
                    Die Fraktion **"${fraktion}"** hat **${warnung}** aktive Warnungen.

                    **Grund der Warnung**: ${grund}

                    Mit freundlichen Grüßen,  
                    **Fraktionsleitung**
                `)
                .setTimestamp()
                .setFooter({
                    text: 'Fraktionsverwaltung',
                });

            try {
                await kanal.send({ embeds: [embed] });
                await interaction.reply({
                    content: 'Die Warnung wurde erfolgreich gesendet!',
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Fehler beim Senden der Warnung:', error);
                interaction.reply({
                    content: 'Es gab einen Fehler beim Senden der Warnung.',
                    ephemeral: true,
                });
            }
        } else if (interaction.options.getSubcommand() === 'discord') {
            const fraktion = interaction.options.getString('fraktion');
            const discordLink = interaction.options.getString('discord');
            const kanal = interaction.options.getChannel('kanal');

            const embed = new EmbedBuilder()
                .setColor('#7289DA')
                .setTitle('» **Fraktion Discord**')
                .setDescription(`
                    Der Discord-Server für die Fraktion **"${fraktion}"**:

                    [Discord-Link](${discordLink})

                    Mit freundlichen Grüßen,  
                    **Fraktionsleitung**
                `)
                .setTimestamp()
                .setFooter({
                    text: 'Fraktionsverwaltung',
                });

            try {
                await kanal.send({ embeds: [embed] });
                await interaction.reply({
                    content: 'Der Discord-Server-Link wurde erfolgreich gepostet!',
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Fehler beim Senden des Discord-Links:', error);
                interaction.reply({
                    content: 'Es gab einen Fehler beim Senden des Discord-Links.',
                    ephemeral: true,
                });
            }
        }
    },
};
