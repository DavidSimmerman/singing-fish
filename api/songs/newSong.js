import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ytdl from 'ytdl-core';

export async function newSong(req, res) {
	console.log(req.body);
	const { videoLink, songTitle } = req.body;
	let dir;

	if (!videoLink) {
		return res.status(400).json({ error: 'No video link' });
	}

	try {
		dir = makeDir(songTitle);
		generateInfo(dir, songTitle);

		streamAudio(videoLink)
			.on('end', () => {
				const message = songTitle + ' has finished downloading';
				console.log(message);
				res.status(200).json({ success: true, message, path: dir.split('/').pop() });
			})
			.on('error', err => {
				console.log('Error extracting audio:', err);
				res.status(500).json({ error: err.toString(), message: 'Conversion failed' });
			})
			.save(dir + '/audio.wav');
	} catch (err) {
		console.error('Error downloading video:', err);
		res.status(500).json({ error: err.toString(), message: 'Failed to download video' });
		if (fs.existsSync(dir)) {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	}
}

function makeDir(songTitle) {
	let dir = 'songs/' + songTitle.replaceAll(/[^a-zA-Z0-9]+/g, '_');
	if (fs.existsSync(dir)) {
		for (const i of Array(100).keys()) {
			if (!fs.existsSync(dir + '_' + i)) continue;
			dir = dir + '_' + i;
			break;
		}
	}
	fs.mkdirSync(dir);

	return dir;
}

function generateInfo(dir, songTitle) {
	fs.writeFile(dir + '/info.json', JSON.stringify({ name: songTitle, actions: [] }), err => {
		if (err) throw err;
	});
}

function streamAudio(link) {
	const videoStream = ytdl(link, { quality: 'highestaudio' });

	return ffmpeg().input(videoStream).audioCodec('pcm_s16le').audioFrequency(44100).audioChannels(2).format('wav');
}
