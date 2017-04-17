const https = require('https');
const { getConfig } = require('./config')

function setStatus({ emoji, message }) {
	return new Promise((resolve, reject) => {
		
		const encoded = encodeURIComponent(JSON.stringify({
			status_emoji: `:${emoji}:`,
			status_text: message
		}));

		https.get(`https://slack.com/api/users.profile.set?token=${getConfig('TOKEN')}&profile=${encoded}`, (res) => {
			res.setEncoding('utf8');
		  
		  let rawData = '';
		  res.on('data', (chunk) => { rawData += chunk; });
		  res.on('end', () => resolve(rawData));

		}).on('error', (e) => {
		  reject(e);
		});
	})
}

module.exports = { setStatus }