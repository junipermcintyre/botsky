var Command = require('./../Command');
const Discord = require('discord.js');

/**
 * Mute all
 * @type {MuteAll}
 */
module.exports = class MuteAll extends Command {
	static get command() 	 { return "mute_all"; }
	static get name() 		 { return "Mute all"; }
	static get permissions() { return [Discord.Permissions.FLAGS.MUTE_MEMBERS]; }

	/**
	 * Mute everyone
	 * @param client
	 * @returns {Promise<number>}
	 */
	async execute(client) {
		let channel = this.getAffectedChannel(client);
		channel.members.each(member => {
			member.voice.setMute(true, "muted by AustraliaBot in MuteAll command");
		});
		return 0;
	}
}
