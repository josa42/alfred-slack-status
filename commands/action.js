'use strict';

const { input } = require('alfy');
const { addRecent, removeRecent } = require('../lib/recent')
const { setStatus } = require('../lib/slack')
const { setConfig } = require('../lib/config')

const { action, emoji, message, token } = JSON.parse(input)



switch (action) {
	case 'remove':
		removeRecent({ emoji, message })
		break;
	case 'add':
		addRecent({ emoji, message })
		break;
	case 'token':
		setConfig('TOKEN', token)
		break;
	case 'send':
	default:
		addRecent({ emoji, message })
		setStatus({ emoji, message })
		break;
}