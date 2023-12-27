import fs from 'fs';
import path from 'path';

export function getAudioFile(req, res) {
	const { song } = req.params;
	const dir = path.join(__dirname, '..', '..', 'songs', song, 'audio.wav');

	if (!fs.existsSync(dir)) return res.status(404).send('Song not found');

	res.sendFile(dir);
}
