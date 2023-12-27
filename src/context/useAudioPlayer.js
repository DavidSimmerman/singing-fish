import { create } from 'zustand';

export const useAudioPlayer = create(set => {
	const store = {
		songLength: null,
		setSongLength: length => set({ songLength: length }),
		songPosition: 0,
		setSongPosition: position => set({ songPosition: position })
	};

	return store;
});
