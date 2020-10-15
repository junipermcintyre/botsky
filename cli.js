#!/usr/bin/env node
/**
 * Botsky is made to be helpful, hopefully
 * It probably will work very poorly
 * This file is an entrypoint to the application. Run it, and 
 * it will enable the commands and services in src/
 *
 * This works like the code in server, but is for testing stuff 
 * on the CLI, or running crons, etc. It spins up an instance, 
 * does its thing, then finishes.
 */

/* Library includes / external files / import classes*/
const config = require('./config.json');
const functions = require('./functions.js');
const Discord = require('discord.js');
const services = require('./src/services');
const commands = require('./src/commands');
const {argv} = require('yargs').command('[options]', 'Run a single service or command', (yargs) => {
    yargs.positional('options', {
        describe: 'command or service to run, with any options',
        default: '--help'
    })
}).option('command', {
    alias: 'c',
    type: 'string',
    description: 'Command name to run'
}).option('service', {
    alias: 's',
    type: 'string',
    desription: 'Service to run'
}).option('arguments', {
    alias: 'a',
    type: 'string',
    description: 'A quote encapsulated mess of arguments for the command to use'
});

// Was a command or service requestd? not both.
if (!argv.command && !argv.service) {
    functions.log("Please specify a service or command. Try ./cli --help");
    functions.log("Here's a list of available commands:");
    for (const command in commands) {
        functions.log("    " + commands[command].command);
    }

    functions.log("Here's a list of available services:");
    for (const service in services) {
        functions.log("    " + service);
    }
    process.exitCode = 1;
}
if (argv.command && argv.service) {
    functions.log("Please only specify one service or command at a time.");
    process.exitCode = 1;
}

// Execute the command if thats the thingy
if (argv.command && !argv.service) {
    for (const command in commands) {
        if (commands[command].command === argv.command) {
            try {
                const client = new Discord.Client();
                client.login(config.token);
                client.on('ready', async () => {
                    functions.log(`Logged in as ${client.user.tag}!`);
                    let theoretical_command = config.prefix + argv.command + (argv.arguments ? (" " + argv.arguments) : "");
                    let fake_msg = {content: theoretical_command};
                    let command_string = functions.resolveCommandFromDiscordMessage(config.prefix, fake_msg);
                    let arguments_array = functions.resolveArgumentsFromDiscordMessage(config.prefix, fake_msg);
                    functions.log("Trying to run " + theoretical_command);

                    let c = new commands[command](config, client, fake_msg, arguments_array);
                    let response = await c.execute(client);
                    if (response === 0) {
                        functions.log("Ran command OK: " + commands[command].name);
                    }
                    if (response > 0) {
                        functions.log("Ran command ERROR: " + commands[command].name, "Error");
                        process.exitCode = 1;
                    }
                    client.destroy(); // TODO <- not working
                });
            } catch (e) {
                functions.log("Failed running command: " + commands[command].name, "Error");
                functions.log(e.toString());
                process.exitCode = 1;
                client.destroy();
            }
        }
    }
} else if (argv.service && !argv.command) { // or register a service
    for (const service in services) {
        if (service === argv.service) {
            try {
                const client = new Discord.Client();
                client.login(config.token);
                client.on('ready', () => {
                    functions.log(`Logged in as ${client.user.tag}!`);
                    let s = new services[service](config, client);
                    s.register(client);
                    functions.log("Registered: " + services[service].name);
                    functions.log("Use CTRL+c to stop the service.");
                });
            } catch (e) {
                functions.log("Failed registering: " + services[service].name, "Error");
                functions.log(e.toString(), "Error");
                process.exitCode = 1;
                client.destroy();
            }
        }
    }
}
