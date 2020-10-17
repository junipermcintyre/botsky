module.exports = class Command {
    constructor(config, client, msg, args) {
        this.args = args;
        this.msg = msg;
    }

    static get command()     { return null; }
    static get name()        { return null; }
    static get permissions() { return []; }

    async execute(client) {
        throw new Error('Execute is not implemented in command ' + this.constructor.name);
    }

    getAffectedChannel(client) {
        if (typeof this.args.channel !== 'undefined') {
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
        } else if (this.msg.member.voice.channel) {
            return this.msg.member.voice.channel;
        } else {
            return this.msg.channel;
        }
    }
}
