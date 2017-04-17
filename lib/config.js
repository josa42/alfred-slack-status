const fs = require('fs')
const path = require('path')

function readConfigObj() {
	try {
		return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'config.json'), 'utf8'));	
	} catch (ex) {}

	return {}
}

function writeConfigObj(config) {
	try {
		fs.writeFileSync(path.join(__dirname, '..', 'data', 'config.json'), JSON.stringify(config));	
	} catch (ex) {}
}

function setConfig(key, value) {
	const config = readConfigObj()

	config[key] = value

	writeConfigObj(config)
}

function getConfig(key, value) {
	const config = readConfigObj()

	return config[key]
}




module.exports = { getConfig, setConfig }