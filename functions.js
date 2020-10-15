module.exports = {
	/**
	 * Yoinked from StackOverflow
	 * @param min
	 * @param max
	 * @returns {number}
	 */
	getRandomInt: function(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	/**
	 * Also yoinked from SO
	 * @param n
	 * @param width
	 * @param z
	 * @returns {string}
	 */
	pad: function(n, width, z) {
	    z = z || '0';
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},

	/**
	 * Personal logging method
	 * @param thing
	 * @param label
	 */
	log: function(thing, label = "Log") {
	    var d = new Date();
	    var d_str = d.getFullYear() + "-" + pad(d.getMonth() + 1, 2) + "-" + pad(d.getDate(), 2) + " " + pad(d.getHours(), 2) + ":" + pad(d.getMinutes(), 2) + ":" + pad(d.getSeconds(), 2);
	    if (typeof thing === 'string')
	        console.log("["+label+"] [" + d_str + "] " + thing)
	    else {
	        console.log("["+label+"] [" + d_str + "] (object below)");
	        console.log(thing);
	    }

	    // lmao
	    function pad(n, width, z) {
		    z = z || '0';
		    n = n + '';
		    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		}
	},

	/**
	 *
	 * @param prefix
	 * @param message
	 * @returns {string}
	 */
	resolveCommandFromDiscordMessage: function(prefix, message) {
		let str = message.content.substring(prefix.length);
		return str.split(" ")[0];
	},

	/**
	 *
	 * @param prefix
	 * @param message
	 */
	resolveArgumentsFromDiscordMessage: function(prefix, message) {
		let str = message.content.substring(prefix.length);
		let str_bits = str.split(" ");
		str_bits.shift();
		str = str_bits.join(" "); // remove command

		if (str === '')
			return {};

		if (str.charAt(0) === '-') // this and the space in split mean us-east is a valid region
			str = " "+str;

		str_bits = str.split(" -"); // split into [[arg_name], [option value..s]]
		let args = {};
		for (let i = 0; i < str_bits.length; i++) {
			let arg_bits = str_bits[i].trim().split(" ");
			if (arg_bits[0] !== '') {
				if (arg_bits.length === 1)
					args[arg_bits[0]] = true; 		 // flag
				else if (arg_bits.length === 2)
					args[arg_bits[0]] = arg_bits[1]; // single value
				else {
					let arg_array = [];
					for (let j = 0; j < arg_bits.length; j++)
						arg_array.push(arg_bits[j]);
					arg_array.shift();
					args[arg_bits[0]] = arg_array; // multiple values
				}
			}
		}
		return args;
	}
}
