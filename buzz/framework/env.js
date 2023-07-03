var module = {
	options: [],
	header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
	dataos: [
		{ name: 'Windows Mobile OS', value: 'Windows Phone', version: 'OS' },
		{ name: 'Windows', value: 'Win', version: 'NT' },
		{ name: 'iOS', value: 'iPhone', version: 'OS' },
		{ name: 'iPad', value: 'iPad', version: 'OS' },
		{ name: 'Kindle', value: 'Silk', version: 'Silk' },
		{ name: 'Android', value: 'Android', version: 'Android' },
		{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
		{ name: 'BlackBerry OS', value: 'BlackBerry', version: '/' },
		{ name: 'macOS', value: 'Mac', version: 'OS X' },
		{ name: 'Linux', value: 'Linux', version: 'rv' },
		{ name: 'PalmOS', value: 'Palm', version: 'PalmOS' }
	],
	databrowser: [
		{ name: 'Chrome', value: 'Chrome', version: 'Chrome' },
		{ name: 'Firefox', value: 'Firefox', version: 'Firefox' },
		{ name: 'Safari', value: 'Safari', version: 'Version' },
		{ name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
		{ name: 'Opera', value: 'Opera', version: 'Opera' },
		{ name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
		{ name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
	],
	init: function () {
		var agent = this.header.join(' '),
			os = this.matchItem(agent, this.dataos),
			browser = this.matchItem(agent, this.databrowser);
		
		return { os: os, browser: browser };
	},
	matchItem: function (string, data) {
		var i = 0,
			j = 0,
			html = '',
			regex,
			regexv,
			match,
			matches,
			version;
		
		for (i = 0; i < data.length; i += 1) {
			regex = new RegExp(data[i].value, 'i');
			match = regex.test(string);
			if (match) {
				regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
				matches = string.match(regexv);
				version = '';
				if (matches) { if (matches[1]) { matches = matches[1]; } }
				if (matches) {
					matches = matches.split(/[._]+/);
					for (j = 0; j < matches.length; j += 1) {
						if (j === 0) {
							version += matches[j] + '.';
						} else {
							version += matches[j];
						}
					}
				} else {
					version = '0';
				}
				return {
					name: data[i].name,
					version: parseFloat(version)
				};
			}
		}
		return { name: 'Undefined', version: 0 };
	}
};

var info = module.init();

class BuzzEnvironment {
	/**
	 * The version of the SDK used by this context. You should only worry about this value when creating libraries from the Buzz
	 * framework to make sure projects that already use your library don't break.
	 * @type {number}
	 */
	static get sdkVersion() {
		return 1;
	}

	/**
	 * The name of the browser of the device currently running your WebApp in execution context.
	 * @type {string}
	 */
	static get browserName() {
		return info.browser.name;
	}

	/**
	 * The version of the browser of the device currently running your WebApp in execution context.
	 * @type {string}
	 */
	static get browserVersion() {
		return info.browser.version;
	}

	/**
	 * Returns a constant from the OperatingSystem class containing the name of the OS this BuzzApp is currently running on.
	 * @type {string}
	 */
	static get operatingSystem() {
		return info.os.name;
	}

	/**
	 * The version of the operating system this BuzzApp is currently running on.
	 * @type {number}
	 */
	static get operatingSystemVersion() {
		return info.os.version;
	}


	/**
	 * The oldest SDK version your current SDK supports. This is used to keep track of just how much backwards compatibility your SDK
	 * was given. Usually useful for library developers only.
	 * @type {number}
	 */
	static get minimumSupportedSdkVersion() {
		return 1;
	}

	/**
	 * Is this a mobile device?
	 *
	 * @type {boolean}
	 */
	static get isMobileDevice() {
		return info.os.name === "Android" || info.os.name === "iOS" || info.os.name === "Blackberry OS" || info.os.name === "PalmOS";
	}
}

export {
	BuzzEnvironment
}