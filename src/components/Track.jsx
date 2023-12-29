import React, { useEffect, useRef } from 'react';
import { useTracks } from '../context/useTracks';
import Action from './Action';

export default function Track({ track }) {
	const actions = useTracks(state => state[track]);
	const addAction = useTracks(state => state.addAction);
	const setStop = useTracks(state => state.setStop);
	const isMouseOnTrack = useRef(false);

	function onMouseDown(e) {
		if (e.target.matches('.track')) isMouseOnTrack.current = true;
	}

	useEffect(() => {
		addEventListener('mouseup', e => {
			if (e.target.matches('.track') && isMouseOnTrack.current) {
				const clickPosition = Math.abs(e.target.offsetLeft) + e.clientX - 20;
				if (e.altKey) setStop(clickPosition);
				else addAction(track, clickPosition);
			}

			isMouseOnTrack.current = false;
		});
	}, []);

	return (
		<div onMouseDown={onMouseDown} className="track w-full h-12 bg-zinc-600 rounded-2xl my-2 relative overflow-hidden">
			{actions.map(action => (
				<Action key={action.id} id={action.id} start={action.start} length={action.length} />
			))}
		</div>
	);
}
