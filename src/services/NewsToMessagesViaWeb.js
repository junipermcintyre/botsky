const Service = require('./../Service');
const functions = require('./../../functions.js');
const Discord = require('discord.js');
const md5 = require('md5');

/**
 * Open up some routes and convert respectable requests into
 * discord messages
 * @type {NewsToMessagesViaWeb}
 */
module.exports = class NewsToMessagesViaWeb extends Service {
    static get name() { return "News To Messages via Web"; }

    /**
     * @param config
     * @param client
     */
    constructor(config, client) {
        super(config, client);
        this.hashed_password = config.express_app.hashed_api_password;
        this.sites_to_channels = config.sites_to_channels;
    }

    /**
     * Listen for news and post to all related news channels
     * @param client
     * @param express_app
     */
    register(client, express_app) {
        express_app.get('/news-test', (req, res) => {
            res.send('Testing a route!!');
        });

        express_app.post('/news', (req, res, next) => {
            // authenticate
            if (typeof req.body === 'undefined' || !this.authenticate(req.body.passphrase)) {
                functions.log("Attempt to post news to NMW with incorrect passphrase");
                res.sendStatus(401);
            } else {
                // validate package ;)
                if (!this.validate(req.body)) {
                    functions.log("Attempt to post news to NMW with invalid body")
                    res.sendStatus(400);
                } else {
                    // execute
                    let channels_tag = this.getAffectedChannelsAndTags(client, req.body.site);
                    let news = this.makeNews(req.body, channels_tag.tag)
                    this.postNews(news, client, req.body, channels_tag.channels);
                    res.sendStatus(200);
                }
            }
            next()
        });
    }

    /**
     * Is the passphrase okay?
     * @param passphrase
     * @returns {boolean}
     */
    authenticate(passphrase) {
        if (typeof passphrase === 'undefined')
            return false;
        return md5(passphrase) === this.hashed_password;
    }

    /**
     * Check all the params are there
     * @param request_body
     * @returns boolean
     */
    validate(request_body) {
        return (request_body.title && request_body.link && request_body.blurb && request_body.date && request_body.author && request_body.category && request_body.site);
    }

    /**
     * Prepare the news to pass to channel send (sendable?)
     * @param request_body
     * @returns {string}
     */
    makeNews(request_body, tag) {
        var string = "**There's news!**\n";
        if (tag !== null) {
            string += '<@&'+tag+'>'+"\n";
        }
        string += "*"+request_body.title+"*\n"
            + "By "+request_body.author+", "+request_body.date+"\n"
            + "*Posted to "+request_body.site+"*\n"
            + request_body.link;
        return string;

        // embeds mean we need to send the picture...
        // harder than using discords opengraph check on links in normal messages
        /*return new Discord.MessageEmbed()
            .setTitle(request_body.title)
            .setDescription(request_body.blurb)
            .setURL(request_body.link)
            .addField('posted', request_body.date)
            .addField('by', request_body.author)
            .addField('under category', request_body.category)
            .setColor(0xd22820)
            .setTimestamp()
            .setFooter('read more at ' + request_body.site);*/
    }

    /**
     * Send news to discord channels
     * @param news
     * @param client
     * @param request_body
     * @returns {Promise<void>}
     */
    async postNews(news, client, request_body, channels) {
        for (var i = 0; i < channels.length; i++) {
            try {
                let embed_result = await channels[i].send(news);
                functions.log("Sent news '"+request_body.title+"' to "+channels[i].guild.name+" in channel "+channels[i].name)
            } catch (error) {
                functions.log(error, "Error");
            }
        }
    }

    /**
     * Custom search method
     * And also the tags...
     * @param client
     * @param channel_name
     * @returns {[]}
     */
    getAffectedChannelsAndTags(client, site_name) {
        var _that = this;
        var _channels = [];

        if (typeof this.sites_to_channels[site_name] !== 'undefined') {
            var channel_names = this.sites_to_channels[site_name].channels;
            var tag = this.sites_to_channels[site_name].tag;
        } else {
            var channel_names = ["news"];
            var tag = null;
        }

        client.channels.cache.each(channel => {
            for (var i = 0; i < channel_names.length; i++) {
                if (channel.type === 'text' && channel_names[i].toLowerCase() === channel.name.toLowerCase()) {
                    _channels.push(channel);
                }
            }
        });
        if (_channels.length === 0) { // look for "news" if the specific one from config is missing
            client.channels.cache.each(channel => {
                if (channel.type === 'text' && "news" === channel.name.toLowerCase()) {
                    _channels.push(channel);
                }
            });
        }
        if (_channels.length === 0) { // if still 0 throw error
            throw new Error("Cannot find any channels called: " + channel_names.join() + " or 'news'");
        }
        else
            return {channels: _channels, tag: tag};
    }
}
