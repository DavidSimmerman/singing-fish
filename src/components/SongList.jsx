import React from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { useSongs } from '../context/useSongs';
import { useTracks } from '../context/useTracks';

export default function SongList() {
	const songs = useSongs(state => state.songs);
	const selectedSong = useSongs(state => state.selected);
	const setSelectedSong = useSongs(state => state.setSelectedSong);
	const toggleSongOpen = useSongs(state => state.toggleSongOpen);
	const deleteSong = useSongs(state => state.deleteSong);
	const hasChanges = useTracks(state => state.hasChanges);

	function onSongChange(e) {
		if (hasChanges) {
			if (!confirm('Are you sure you want to switch songs? any unsaved changes will be lost.')) return;
		}
		setSelectedSong(e.target.value);
	}

	function onDeleteSong() {
		if (confirm('Are you sure you want to delete ' + selectedSong)) {
			deleteSong(selectedSong);
		}
	}

	return (
		<div className="flex align-middle items-center">
			<select
				className="cursor-pointer bg-transparent border-b-2 border-white text-white text-2xl"
				value={selectedSong}
				onChange={onSongChange}
			>
				{songs.map((song, i) => (
					<option className="bg-zinc-700" key={i} value={song.path}>
						{song.name}
					</option>
				))}
			</select>
			<div
				className="cursor-pointer text-white flex items-center aspect-square h-fit rounded-3xl ml-2 hover:bg-black p-0.5 hover:bg-opacity-50 hover:text-rose-600"
				onClick={onDeleteSong}
				data-tooltip-target="delete"
			>
				<FiMinusCircle className="w-5 h-5" />
			</div>
			<div
				className="cursor-pointer text-white flex items-center aspect-square h-fit rounded-3xl hover:bg-black p-0.5 hover:bg-opacity-50 hover:text-emerald-500"
				onClick={toggleSongOpen}
			>
				<FiPlusCircle className="w-5 h-5" />
			</div>
		</div>
	);
}
