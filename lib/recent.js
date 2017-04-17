const fs = require('fs')
const path = require('path')

function getRecent() {
	try {
		return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'recent.json'), 'utf8'));	
	} catch (ex) {}

	return []
}

function isInRecent(entry) {
	return getRecent().some(({ message })  => message === entry.message)
}

function addRecent(entry) {
	const recent = getRecent().filter(({ message })  => message !== entry.message)

	recent.unshift(entry)

	fs.writeFileSync(path.join(__dirname, '..', 'data', 'recent.json'), JSON.stringify(recent));	
}

function removeRecent(entry) {
	const recent = getRecent().filter(({ message })  => message !== entry.message)
	fs.writeFileSync(path.join(__dirname, '..', 'data', 'recent.json'), JSON.stringify(recent));	
}


module.exports = { getRecent, addRecent, removeRecent, isInRecent }