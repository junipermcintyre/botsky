/*var normalizedPath = require("path").join(__dirname);

require("fs").readdirSync(normalizedPath).forEach(function(file) {
	console.log(file);
  require("./" + file);
});
*/

module.exports = {
	news_to_messages_via_web: require('./NewsToMessagesViaWeb')
};
