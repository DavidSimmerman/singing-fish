import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSongs } from '../context/useSongs';

export default function NewSongModal() {
	const toggleSongOpen = useSongs(state => state.toggleSongOpen);
	const newSong = useSongs(state => state.addNewSong);
	const [songName, setSongName] = useState('');
	const [songLink, setSongLink] = useState('');

	async function onSubmit(e) {
		e.preventDefault();

		await newSong(songName, songLink);
		toggleSongOpen();

		setSongName('');
		setSongLink('');
	}

	return (
		<div
			onClick={e => e.target.matches('.backdrop') && toggleSongOpen()}
			className="backdrop absolute w-full z-10 bg-zinc-700 bg-opacity-60 top-0 bottom-0 left-0 flex"
		>
			<form
				onSubmit={onSubmit}
				className="bg-zinc-700 w-[500px] h-fit p-6 m-auto text-white flex flex-col rounded-xl shadow-lg shadow-zinc-800 relative"
			>
				<IoClose className="absolute top-1.5 right-1.5 h-5 w-5 cursor-pointer" onClick={toggleSongOpen} />
				<label htmlFor="songName">Song Name:</label>
				<input
					className="bg-transparent border-b-[1px] border-white mb-3"
					type="text"
					id="songName"
					name="songName"
					value={songName}
					onChange={e => setSongName(e.target.value)}
					required
				/>
				<label htmlFor="songLink">Song Link:</label>
				<input
					className="bg-transparent border-b-[1px] border-white mb-3"
					type="url"
					id="songLink"
					name="songLink"
					value={songLink}
					onChange={e => setSongLink(e.target.value)}
					required
				/>
				<button className="bg-zinc-500 w-fit px-3 py-0.5 rounded-md m-auto mt-3" type="submit" value="Submit">
					Submit
				</button>
			</form>
		</div>
	);
}
