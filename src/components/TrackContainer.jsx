import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/useAudioPlayer';
import { useSongs } from '../context/useSongs';
import { useTracks } from '../context/useTracks';
import Track from './Track';

const SCALER = 1000;

export default function TrackContainer() {
	const selectedSong = useSongs(state => state.selected);
	const songLength = useAudioPlayer(state => state.songLength);
	const songPosition = useAudioPlayer(state => state.songPosition);
	const loadActions = useTracks(state => state.loadActions);
	const deleteSelectedActions = useTracks(state => state.deleteSelectedActions);
	const setTrackEnd = useTracks(state => state.setTrackEnd);
	const addAction = useTracks(state => state.addAction);
	const growAction = useTracks(state => state.growAction);

	const scrollableRef = useRef(null);
	const growingActionRef = useRef(null);
	let trackWidth = 0;
	let scroll = 0;
	let indicatorPosition = 0;

	if (scrollableRef.current) {
		const scrollable = scrollableRef.current;
		const scrollWindowWidth = scrollable.clientWidth;
		const songPosPx = songPosition * SCALER;
		trackWidth = songLength * SCALER;

		if (songPosPx <= scrollWindowWidth / 2) {
			indicatorPosition = songPosPx;
			scroll = 0;
		} else if (songPosPx >= trackWidth - scrollWindowWidth / 2) {
			indicatorPosition = scrollWindowWidth - (trackWidth - songPosPx);
			scroll = trackWidth - scrollWindowWidth;
		} else {
			indicatorPosition = scrollWindowWidth / 2;
			scroll = songPosPx - indicatorPosition;
		}
	}

	useEffect(() => {
		loadActions(selectedSong);
	}, [selectedSong]);

	useEffect(() => {
		setTrackEnd(trackWidth);
	}, [trackWidth]);

	useEffect(() => {
		if (growingActionRef.current !== null) {
			growAction(growingActionRef.current, songPosition * SCALER);
		}

		addEventListener('keydown', onKeyDown);

		return () => removeEventListener('keydown', onKeyDown);

		function onKeyDown(e) {
			if (!['1', '2', '3'].includes(e.key) || e.repeat) return;

			let track;
			if (e.key === '1') track = 'mouth';
			else if (e.key === '2') track = 'head';
			else if (e.key === '3') track = 'tail';

			console.log(songPosition);
			growingActionRef.current = addAction(track, songPosition * SCALER, { length: 'min', startMiddle: false });
		}
	}, [songPosition]);

	useEffect(() => {
		addEventListener('keyup', e => {
			if (e.key === 'Backspace') deleteSelectedActions();
			else if (['1', '2', '3'].includes(e.key)) growingActionRef.current = null;
		});
	}, []);

	return (
		<div ref={scrollableRef} className="w-full my-2 overflow-hidden relative">
			<div className="track-scroller" style={{ width: trackWidth + 'px', marginLeft: '-' + scroll + 'px' }}>
				<Track track="mouth" />
				<Track track="head" />
				<Track track="tail" />
			</div>
			<div className="w-[1px] h-full bg-white absolute top-0" style={{ marginLeft: indicatorPosition + 'px' }}></div>
		</div>
	);
}
