import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../context/useAudioPlayer';
import { useSongs } from '../context/useSongs';

export default function AudioPlayer() {
	const { selected } = useSongs();
	const setSongLength = useAudioPlayer(state => state.setSongLength);
	const setSongPosition = useAudioPlayer(state => state.setSongPosition);
	const audioRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!audioRef?.current) return;

		const audioElem = audioRef.current;

		audioElem.addEventListener('loadedmetadata', () => setSongLength(audioElem.duration));
		audioElem.addEventListener('seeking', () => setSongPosition(audioElem.currentTime));
		audioElem.addEventListener('pause', () => setIsPlaying(false));
		audioElem.addEventListener('play', () => setIsPlaying(true));
	}, []);

	useEffect(() => {
		if (!isPlaying) return;

		const playingInterval = setInterval(() => setSongPosition(audioRef.current.currentTime), 50);

		return () => clearInterval(playingInterval);
	}, [isPlaying]);

	return (
		<div>
			<audio
				ref={audioRef}
				controls
				controlsList="nodownload"
				className="w-full"
				src={`/audio/${selected}`}
				tabIndex="0"
			></audio>
		</div>
	);
}
