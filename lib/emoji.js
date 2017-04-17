const path = require('path');
const emojiData = require('emoji-data');
const mkdirp = require('mkdirp');
const { sync: exists } = require('file-exists')
const download = require('image-downloader')
const { fetch } = require('alfy');

const { getConfig } = require('../lib/config')

const defaultEmojis = emojiData.all().reduce((all, { short_name, image  }) => {
	all[short_name] = `https://github.com/iamcal/emoji-data/raw/master/img-apple-160/${image}`;
	return all;
}, {})

async function getURL(key) {
	if (defaultEmojis[key]) {
		return defaultEmojis[key]
	}

	const customEmojis = await getCustomEmojis()
	return customEmojis[key]
}

async function getPathByKey(key) {
	return getPathByUrl(await getURL(key))
}

async function getPathByUrl(url) {

	if (!url) {
		return null
	}

	const dest = path.join(__dirname, '..', 'data/images')
	const destFile = path.join(dest, path.basename(url))

	if (exists(destFile)) {
		return destFile
	}

	mkdirp.sync(dest)
	
	try {
	  const { filename, image } = await download.image({ url,  dest })
	  return destFile
	} catch (e) {
		console.log(e)
	}

	return null
}

function resolveAlias(key, customEmoji)  {

	key = key.replace(/^alias:/, '')
	const value = customEmoji[key] || defaultEmojis[key]

	if (/^alias:/.test(value)) {
		return resolveAlias(value, customEmoji)
	}

	return value
}

async function getAllEmojis()  {

	const customEmoji = await getCustomEmojis()

	return Object.keys(customEmoji).concat(Object.keys(defaultEmojis))
			.map((key) => ({ key, url: resolveAlias(key, customEmoji) }))
}

async function getCustomEmojis() {
	const { emoji } = await fetch(`https://slack.com/api/emoji.list?token=${getConfig('TOKEN')}`)

	return Object.keys(emoji).reduce((all, key) => {
		all[key] = resolveAlias(key, emoji);
		return all;
	}, {})
}

module.exports = { getURL, getPathByKey, getPathByUrl, getAllEmojis }