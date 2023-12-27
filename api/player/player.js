import playsound from 'play-sound';

const player = playsound();

export function playSong(req, res) {
	const { song } = req.body;
	const audio = player.play(`public/songs/${song}/aduio.wav`);
	res.json({ success: true });
	setTimeout(() => audio.kill(), 5000);
}
