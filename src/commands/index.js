/*var normalizedPath = require("path").join(__dirname);

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./" + file);
});*/

module.exports = {
	mute_all: require('./MuteAll'),
	unmute_all: require('./UnmuteAll'),
	deafen_all: require('./DeafenAll'),
	undeafen_all: require('./UndeafenAll'),
	ping: require('./Ping'),
	md5: require('./Md5')
};
