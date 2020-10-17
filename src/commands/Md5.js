var Command = require('./../Command');
const md5 = require('md5');

/**
 * md5 wrapper!
 * @type {Ping}
 */
module.exports = class Ping extends Command {
    static get command()     { return "md5"; }
    static get name()        { return "md5"; }
    static get permissions() { return []; }

    getAffectedChannel(client) {
        if (typeof this.args.channel !== 'undefined') { // get the channel if it was passed
            var _that = this;
            var _channel = null;
            client.channels.cache.each(channel => {
                if (channel.type === 'voice' || channel.type === 'text') {
                    if (_that.args.channel.toLowerCase() === channel.name.toLowerCase()) {
                        _channel = channel;
                    }
                }
            });
            if (_channel === null)
                throw new Error("Cannot find any channel called " + this.args.channel);
            else
                return _channel;
        } else {
            return this.msg.channel;
        }
    }

    /**
     * Simple test command
     * @param client
     * @returns {Promise<number>}
     */
    async execute(client) {
        let channel = this.getAffectedChannel(client);
        if (this.args.t)
            await channel.send(md5(this.args.t));
        else
            await channel.send("Please specify -t parameter *(e.g. \"!md5 -t somephrasehere\")*");
        return 0;
    }
}
