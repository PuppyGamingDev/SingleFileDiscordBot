// Required imports
const { Client, Intents, Events, SlashCommandBuilder } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
var config = require("./config.json");

// Set the Client's Intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Runs 'once' Client has logged in
client.once(Events.ClientReady, async () => {
	// Register all Slash Commands to Discord API on startup
	await RegisterCommands();
	console.log("Ready!");
});

// Debugging
client.on(Events.Debug, console.log);

// Catch and handle Slash Commands
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	// Handle each command
	switch (commandName) {
		case 'example1': {
			return await interaction.reply('This is an example command');
		}

		case 'example2': {
			return await interaction.reply('This is another example command');
		}

		case 'examplesubcommands': {
			const subcommand = interaction.options.getSubcommand();
			switch (subcommand) {
				case 'subcommand1': {
					const stringOption = interaction.options.getString('stringoption');
					return await interaction.reply(`Subcommand 1 with string option: ${stringOption}`);
				}

				case 'subcommand2': {
					const numberOption = interaction.options.getNumber('numberoption');
					return await interaction.reply(`Subcommand 2 with number option: ${numberOption}`);
				}

			}
		}

	}

});

// Make and register all Slash Commands
const RegisterCommands = async () => {
	const commands = [
		new SlashCommandBuilder().setName('example1')
			.setDescription('Just an example command'),
		new SlashCommandBuilder().setName('example2')
			.setDescription('Another example command'),
		new SlashCommandBuilder().setName('examplesubcommands')
			.setDescription('Example command with subcommands')
			.addSubcommand(subcommand =>
				subcommand
					.setName('subcommand1')
					.setDescription('Subcommand 1 description')
					.addStringOption(option => option.setName('stringoption').setDescription('A string option')))
			.addSubcommand(subcommand =>
				subcommand
					.setName('subcommand2')
					.setDescription('Subcommand 2 description')
					.addNumberOption(option => option.setName('numberoption').setDescription('A number option'))),
	]
		.map(command => command.toJSON());

	const rest = new REST({ version: '10' }).setToken(token);

	rest.put(Routes.applicationCommands(config.clientId), { body: commands })
		.then(data => console.log(`Successfully registered ${data.length} global application commands.`))

	return;
}


client.login(config.token);