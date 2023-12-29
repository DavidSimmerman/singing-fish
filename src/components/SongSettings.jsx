import React, { useEffect } from 'react';
import { FiMusic, FiSave } from 'react-icons/fi';
import { useSongs } from '../context/useSongs';
import { useTracks } from '../context/useTracks';

export default function SongSettings() {
	const hasChanges = useTracks(state => state.hasChanges);
	const exportActions = useTracks(state => state.exportActions);
	const playSong = useSongs(state => state.playSong);

	function saveSong() {
		if (!hasChanges) return;
		exportActions();
	}

	function confirmLeave() {
		if (!hasChanges) return true;
		else return confirm('Are you sure you want to leave? Any unsaved changes will be lost!');
	}

	useEffect(() => (window.onbeforeunload = confirmLeave), []);

	return (
		<div className="flex align-middle items-center">
			<div
				className="cursor-pointer text-white flex items-center aspect-square h-fit rounded-3xl hover:bg-black p-0.5 hover:bg-opacity-50"
				onClick={playSong}
			>
				<FiMusic className="w-5 h5" />
			</div>
			<div
				className={
					'flex items-center aspect-square h-fit rounded-3xl p-0.5 ' +
					(hasChanges ? 'cursor-pointer text-white hover:bg-black hover:bg-opacity-50' : 'text-zinc-400')
				}
				onClick={saveSong}
			>
				<FiSave className="w-5 h5" />
			</div>
		</div>
	);
}
