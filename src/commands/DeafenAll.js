var Command = require('./../Command');
const Discord = require('discord.js');

/**
 * Deafen everyone
 * @type {DeafenAll}
 */
module.exports = class DeafenAll extends Command {
    static get command()     { return "deafen_all"; }
    static get name()        { return "Deafen all"; }
    static get permissions() { return [Discord.Permissions.FLAGS.DEAFEN_MEMBERS]; }

    /**
     * Deafen everyone
     * @param client
     * @returns {Promise<number>}
     */
    async execute(client) {
        let channel = this.getAffectedChannel(client);
        channel.members.each(member => {
            member.voice.setDeaf(true, "deafened by AustraliaBot in DeafenAll command");
        });
        return 0;
    }
}
