import { Gpio } from 'onoff';
import Player from 'play-sound';

export default FishController();

function FishController() {
	const controller = {
		playSong,
		stopSong,
		active: true
	};

	if (!Gpio.accessible) {
		console.log('GPIO is notaccessible on this device.');
		// Disable all functions to prevent errors
		Object.keys(controller).forEach(key => (controller[key] = () => {}));
		controller.active = false;
		return controller;
	}

	const pins = {
		button: new Gpio(17, 'in', 'falling'),
		mouthClose: new Gpio(23, 'out'),
		mouthOpen: new Gpio(24, 'out'),
		head: new Gpio(7, 'out'),
		tail: new Gpio(8, 'out')
	};

	let isPlaying = false;
	let audioProcess, songClock, startTime;

	const player = Player();

	pins.button.watch(onButtonPress);

	return controller;

	function onButtonPress() {
		if (!isPlaying) playRandom();
		else stopSong();
	}

	function playRandom() {
		const songs = fs.readdirSync('songs');
		const randomSong = songs[Math.floor(Math.random() * DataTransferItemList.length)];
		playSong(randomSong);
	}

	function playSong(songPath) {
		// stop playing any active song
		stopSong();

		const dir = 'songs/' + songPath;
		if (!fs.existsSync(dir)) return console.log('Error: trying to play song ', songPath, " doesn't exist.");

		const { actions } = JSON.parse(fs.readFileSync(dir + '/info.json', 'utf8'));
		const audioPath = dir + '/audio.wav';

		isPlaying = true;
		audioProcess = player.play(audioPath);
		startTime = new Date().getTime();

		runActions(actions);
	}

	function stopSong() {
		isPlaying = false;
		audioProcess?.kill();
		clearInterval(songClock);
		motorsOff();
	}

	async function runActions(actions) {
		for (const action of actions) {
			const timeToEvent = action.time - getTime();
			await sleep(timeToEvent);

			if (!isPlaying) break;

			if (action.action === 'stop') stopSong();
			else doAction(action.motor, action.action);
		}
	}

	function doAction(motor, action) {
		if (motor === 'mouth') {
			pins.mouthClose.writeSync(action === 'on' ? 0 : 1);
			pins.mouthOpen.writeSync(action === 'on' ? 1 : 0);
		} else if (motor === 'head') {
			pins.tail.writeSync(0);
			pins.head.writeSync(action === 'on' ? 1 : 0);
		} else if (motor === 'tail') {
			pins.head.writeSync(0);
			pins.tail.writeSync(action === 'on' ? 1 : 0);
		}
	}

	function motorsOff() {
		pins.mouthClose.writeSync(0);
		pins.mouthOpen.writeSync(0);
		pins.head.writeSync(0);
		pins.tail.writeSync(0);
	}

	function getTime() {
		return new Date().getTime() - startTime;
	}

	function sleep(timeout) {
		return new Promise(res => setTimeout(res, timeout));
	}
}
