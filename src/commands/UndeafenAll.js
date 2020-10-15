var Command = require('./../Command');
const Discord = require('discord.js');

/**
 * Undeafen everyone
 * @type {UndeafenAll}
 */
module.exports = class UndeafenAll extends Command {
    static get command()     { return "undeafen_all"; }
    static get name()        { return "Undeafen all"; }
    static get permissions() { return [Discord.Permissions.FLAGS.DEAFEN_MEMBERS]; }

    /**
     * Undeafen everyone
     * @param client
     * @returns {Promise<number>}
     */
    async execute(client) {
        let channel = this.getAffectedChannel(client);
        channel.members.each(member => {
            member.voice.setDeaf(false, "undeafened by AustraliaBot in UnDeafenAll command");
        });
        return 0;
    }
}
