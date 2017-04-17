'use strict';

const path = require('path');
const { input, output } = require('alfy');
const fuzzy = require('fuzzy');
const { getRecent, isInRecent } = require('../lib/recent')
const { getConfig } = require('../lib/config')
const { getPathByKey, getAllEmojis, getPathByUrl } = require('../lib/emoji')


; (async () => {
	if (!getConfig('TOKEN')) {
		output([{
			title: 'Set API token',
    	icon: {  type: "file", path: path.join(__dirname, '..', 'D2C74A5C-72B9-4293-A455-B4F3AF0FBB55.png') },
    	arg: JSON.stringify({ action: 'token', token: input }),
    	
		}])
	}
	else if (input.match(/^:[^:]*$/, '')) {
		const emojiItems = await getAllEmojis()

		output(await Promise.all(fuzzy
			.filter(input.replace(/(^:|:$)/, ''), emojiItems, { extract: ({ key }) => key })
			.slice(0, 10)
			.map(async ({ original: { key, url } }) => ({
	    	title: `:${key}:`,
	    	autocomplete: `:${key}: `,
	    	icon: {  type: "file", path: await getPathByUrl(url) },
	    	valid: false
	    }))
	  ));
	} else if (input.match(/^:([a-z_]+):\s*(.*)$/, '')) {

		const [, emoji, message] = input.match(/^:([a-z_]+):\s*(.*)$/, '')

		output([{
			title: message,
			subtitle: 'Set status',
    	icon: {  type: "file", path: await getPathByKey(emoji) },
    	arg: JSON.stringify({ action: 'send', emoji, message }),
    	mods: {
	    	alt: isInRecent({ emoji, message }) ? {
    			subtitle: 'Remove status',
	        arg: JSON.stringify({ action: 'remove', emoji, message }),
	    	} : {
    			subtitle: 'Add status',
	        arg: JSON.stringify({ action: 'add', emoji, message }),
	    	}
			}
		}])
	} else {

		let recent = getRecent()

		if (input.replace(/\s*/g, '')) {
			recent = fuzzy
				.filter(input.toLowerCase(), recent, { extract: ({ emoji, message }) => `:${emoji}: ${message}`.toLowerCase() })
				.map(({ original }) => original)
		}

		if (recent.length) {
			output(await Promise.all(
				recent.map(async ({ emoji, message }) => ({
		    	title: `${message}`,
		    	subtitle: 'Set status',
		    	icon: {  type: "file", path: await getPathByKey(emoji) },
		    	autocomplete: `:${emoji}: ${message}`,
		    	arg: JSON.stringify({ action: 'send', emoji, message }),
		    	mods: {
			    	alt: {
		    			subtitle: 'Remove status',
			        arg: JSON.stringify({ action: 'remove', emoji, message }),
			    	}
					}
		    }))
		  ))
		} else {

			output([{
				title: 'No Results',
				subtitle: 'Usage: ":<emoji>: <message>"',
				icon: {  type: "file", path: path.join(__dirname, '..', 'D2C74A5C-72B9-4293-A455-B4F3AF0FBB55.png') },
				valid: false
			}])
		}
	}
})()