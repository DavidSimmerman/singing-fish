import fishController from '../../fishController/fishController';

export function playSong(req, res) {
	const { songPath } = req.body;

	if (songPath) fishController.playSong(songPath);
	else fishController.playRandom();

	res.status(200).json({ success: true });
}
