import fs from 'fs';

export async function deleteSong(req, res) {
	const { path } = req.body;

	const dir = 'songs/' + path;

	if (fs.existsSync(dir)) {
		try {
			fs.rmSync(dir, { recursive: true, force: true });
			res.status(200).json({ success: true });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: err.toString(), message: 'error deleting song ' + path });
		}
	} else {
		res.status(404).json({ error: 'Song not found', message: 'The requested song does not exist.' });
	}
}
