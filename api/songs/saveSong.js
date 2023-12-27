import fs from 'fs';

export function saveSong(req, res) {
	const { path, actions } = req.body;

	const file = 'songs/' + path + '/info.json';

	const songData = JSON.parse(fs.readFileSync(file, 'utf8'));
	songData.actions = actions;

	fs.writeFileSync(file, JSON.stringify(songData));
	res.status(200).json({ success: true });
}
