import { create } from 'zustand';

export const useSongs = create((set, get) => {
	const store = {
		songs: [],
		refreshSongs,
		selected: undefined,
		setSelectedSong,
		newSongOpen: false,
		toggleSongOpen: () => set(state => ({ newSongOpen: !state.newSongOpen })),
		addNewSong,
		deleteSong,
		saveSong,
		playSong
	};

	store.refreshSongs();

	return store;

	async function refreshSongs(selectedSong) {
		const selected = get()?.selected;
		const { songs } = await fetch('/api/songs').then(r => r.json());
		const updates = { songs };
		if (selectedSong) updates.selected = selectedSong;
		else if (!selected && songs.length > 0) updates.selected = songs[0].path;
		set(updates);
	}

	function setSelectedSong(songPath) {
		console.log('new song:', songPath);
		set({ selected: songPath });
	}

	async function addNewSong(name, link) {
		const response = await fetch('/api/songs', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				songTitle: name,
				videoLink: link
			})
		});

		if (response.status !== 200) {
			try {
				const data = await response.json();
				alert(`There was an error submitting song: ${response.status} - ${JSON.stringify(data)}`);
				return { error: response.status, message: data };
			} catch (_) {
				alert(`There was an error submitting song: ${response.status}`);
				return { error: response.status };
			}
		}

		const data = await response.json();
		const path = data.path;

		return refreshSongs(path);
	}

	async function deleteSong(songPath) {
		const response = await fetch('/api/songs', {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				path: songPath
			})
		});

		if (response.status !== 200) {
			try {
				const data = await response.json();
				alert(`There was an error deleting song: ${response.status} - ${JSON.stringify(data)}`);
				return { error: response.status, message: data };
			} catch (_) {
				alert(`There was an error deleting song: ${response.status}`);
				return { error: response.status };
			}
		}

		return refreshSongs();
	}

	async function saveSong(actions) {
		const response = await fetch('/api/songs', {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				path: get().selected,
				actions
			})
		});

		if (response.status !== 200) {
			try {
				const data = await response.json();
				alert(`There was an error saving song: ${response.status} - ${JSON.stringify(data)}`);
				return { error: response.status, message: data };
			} catch (_) {
				alert(`There was an error saving song: ${response.status}`);
				return { error: response.status };
			}
		}

		alert('Song successfully saved.');
		return refreshSongs();
	}

	async function playSong() {
		const songPath = get().selected;
		await fetch('/api/songs', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				songPath
			})
		});
	}
});
