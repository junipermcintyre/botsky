var Command = require('./../Command');
const Discord = require('discord.js');

/**
 * Unmute everyone
 * @type {UnmuteAll}
 */
module.exports = class UnmuteAll extends Command {
	static get command() 	 { return "unmute_all"; }
	static get name() 		 { return "Unmute all"; }
	static get permissions() { return [Discord.Permissions.FLAGS.MUTE_MEMBERS]; }

	/**
	 * Mute everyone
	 * @param client
	 * @returns {Promise<number>}
	 */
	async execute(client) {
		let channel = this.getAffectedChannel(client);
		channel.members.each(member => {
			member.voice.setMute(false, "unmuted by AustraliaBot in UnmuteAll command");
		});
		return 0;
	}
}
