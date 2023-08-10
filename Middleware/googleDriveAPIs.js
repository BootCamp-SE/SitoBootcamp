const { google } = require('googleapis');
const createReadStream = require('fs').createReadStream;
const path = require('path');

const pKey = require('../Config/credentials.json');
const Scopes = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
	const jwtClient = new google.auth.JWT(
		pKey.client_email,
		null,
		pKey.private_key,
		Scopes,
		null,
		pKey.private_key_id,
	);
	await jwtClient.authorize();
	return jwtClient;
}

/**
 * Ulpoad a file and share with everyone
 * @param {string} filePath Path of the file to upload.
 * @returns file share link
 */
const uploadFile = async (filePath) => {
	const drive = google.drive({version: 'v3', auth: await authorize()});

	if (filePath) {
		const file = await drive.files.create({
			media: {
				body: createReadStream(filePath),
			},
			fields: 'id, webContentLink',
			requestBody: {
				name: path.basename(filePath),
			},
		});

		await drive.permissions.create({
			fileId: file.data.id,
			requestBody: {
				type: 'anyone',
				role: 'reader',
				allowFileDiscovery: false,
			},
		});

		console.log(`File uploaded! (${file.data.id})`);
		return file.data.webContentLink;
	}
};

module.exports = {
	uploadFile,
};