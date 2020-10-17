module.exports = class Service {
	constructor(config, client) { this.poll_rate = config.default_poll_rate; }
	static get name() { return null; }

	/**
	 * Register this service! By default assumes a polling service based on execute.
	 * @param client
	 * @param express_app
	 */
	register(client, express_app) {
		if (this.name === null)
			throw new Error('Service has not been given a name in ' + this.constructor.name);

		// todo wrap the execute method with a try catch
		client.setInterval(this.execute.bind(this, client), this.poll_rate); // this line should be moved to Service -> not sure how?
	}

	/**
	 * Run some method every poll ms.
	 * This function is required if using the default register above,
	 * otherwise, overwrite register (see NewsListener for example)
	 */
	execute() {
		throw new Error('Execute is not implemented in service ' + this.constructor.name);
	}
}
