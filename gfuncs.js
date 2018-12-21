const fs = require("fs");

function time() {
	let locale = process.env.LANGUAGE.replace("_", "-");
	let options = {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	};

	return "[" + new Date().toLocaleString(locale, options) + "]";
}

module.exports = { time: time };
