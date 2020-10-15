module.exports = class Service {
	constructor(config, client) {
		this.poll_rate = config.default_poll_rate;
	}

	static get name() {
		return null;
	}

	register(client) {
		if (this.name === null)
			throw new Error('Service has not been given a name in ' + this.constructor.name);

		// todo wrap the execute method with a try catch
		client.setInterval(this.execute.bind(this, client), this.poll_rate); // this line should be moved to Service -> not sure how?
	}

	execute() {
		throw new Error('Execute is not implemented in service ' + this.constructor.name);
	}
}
