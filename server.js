#!/usr/bin/env node
/**
 * Botsky is made by me for me for me and my comrades
 * It probably will work very poorly
 * This file is an entrypoint to the application. Run it, and 
 * it will enable the commands and services in src/
 *
 * This file takes all the services available and runs them on 
 * their polling timers
 * It also registers a message listener based on the config.prefix
 * and checks messages for any enabled commands
 */

/* Library includes / external files / import classes*/
const config = require('./config.json');
const functions = require('./functions.js');
const Discord = require('discord.js');
const services = require('./src/services');
const commands = require('./src/commands');
const express = require("express"); // >:(
const express_app = express();
express_app.use(express.json());

/* Connect to discord */
const client = new Discord.Client();
client.login(config.token);
client.on('ready', () => {
    functions.log(`Logged in as ${client.user.tag}!`);
});


/* Register services */
client.on('ready', () => {
    functions.log(`Registering services...`);
    for (const service in services) {
        try {
            let s = new services[service](config, client);
            s.register(client, express_app);
            functions.log("Registered: " + services[service].name);
        } catch (e) {
            functions.log("Failed registering: " + services[service].name);
            functions.log(e);
        }
    }

    /* Launch a webserver */
    if (config.express_app.enabled) {
        express_app.listen(config.express_app.port, () => {
            functions.log("Express app running on " + config.express_app.port);
            let endpoints = express_app._router.stack.filter(x=> x.route && x.route.path && Object.keys(x.route.methods) !== 0).map(layer => ({ method :layer.route.stack[0].method.toUpperCase(), path: layer.route.path}));
            functions.log(endpoints);
        });
    }
});

/* Commands listener */
client.on('message', msg => {
    if (msg.content.startsWith(config.prefix)) {
        let command_string = functions.resolveCommandFromDiscordMessage(config.prefix, msg);
        let arguments_array = functions.resolveArgumentsFromDiscordMessage(config.prefix, msg);

        for (const command in commands) {
            if (commands[command].command === command_string) {
                try {
                    for (var k = 0; k < commands[command].permissions.length; k++)
                        if (!msg.member.hasPermission(commands[command].permissions[k]))
                            throw new Error("User " + msg.member.nickname + " is missing permission " + commands[command].permissions[k]);

                    let c = new commands[command](config, client, msg, arguments_array);
                    c.execute(client).then((response) => {
                        if (response === 0)
                            functions.log("Ran command OK: " + commands[command].name);
                        if (response > 0) {
                            functions.log("Ran command ERROR: " + commands[command].name);
                            functions.log(client, "Client");
                            functions.log(response, "Error response");
                            // What do we do? whats wrong with client?? just restart in case for now...
                            process.exit(1);
                        }
                    }).catch((error) => {
                        functions.log(client, "Client");
                        functions.log(error, "Error");
                    });
                } catch (e) {
                    functions.log("Failed running command: " + commands[command].name);
                    functions.log(e.toString());
                }
            }
        }
    }
});
