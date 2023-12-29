import { create } from 'zustand';
import { useSongs } from './useSongs';

const DEFAULT_ACTION_LENGTH = 150;
const MIN_ACTION_LENGTH = 64;

export const useTracks = create((set, get) => {
	const store = {
		mouth: [],
		head: [],
		tail: [],
		stop: undefined,
		setStop,
		hasChanges: false,
		loadActions,
		addAction,
		removeAction,
		updateAction,
		selectedActions: [],
		addSelectedActions,
		setSelectedActions,
		removeSelectedActions,
		clearSelectedActions,
		moveSelectedActions,
		resizeSelectedActions,
		deleteSelectedActions,
		trackEnd: 0,
		setTrackEnd: end => set({ trackEnd: end }),
		growAction,
		exportActions
	};

	let currentId = 0;

	return store;

	function setStop(position) {
		set({ stop: position });
	}

	function loadActions(songPath) {
		const { songs } = useSongs.getState();
		const song = songs.find(song => song.path === songPath);
		if (!song) return;
		const actions = song.actions;

		currentId = 0;

		const { mouth, head, tail, stop } = actions.reduce(
			(tracks, action) => {
				if (action.action === 'stop') tracks.stop = action.time;
				else if (action.action === 'on') tracks.opened[action.motor] = action;
				else if (action.action === 'off') {
					const opening = tracks.opened[action.motor];
					tracks[action.motor].push({
						id: currentId++,
						start: opening.time,
						length: action.time - opening.time
					});
					delete tracks.opened[action.motor];
				}
				return tracks;
			},
			{ mouth: [], head: [], tail: [], stop: undefined, opened: {} }
		);

		set({ mouth, head, tail, stop, hasChanges: false });
	}

	function addAction(track, start, options = {}) {
		let { length = DEFAULT_ACTION_LENGTH, startMiddle = true } = options;
		if (!['mouth', 'head', 'tail'].includes(track)) throw 'invalid track name';

		const id = currentId++;
		if (length === 'min') length = MIN_ACTION_LENGTH;

		set(state => ({
			[track]: [
				...state[track],
				{
					id,
					start: Math.min(Math.max(startMiddle ? start - length / 2 : start, 0), state.trackEnd - length),
					length
				}
			],
			hasChanges: true
		}));

		return id;
	}

	function removeAction(track, id) {
		if (!['mouth', 'head', 'tail'].includes(track)) throw 'invalid track name';

		set(state => ({ [track]: state[track].filter(action => action.id !== id), hasChanges: true }));
	}

	function updateAction(track, id, start, length) {
		if (!['mouth', 'head', 'tail'].includes(track)) throw 'invalid track name';

		set(state => ({
			[track]: state[track].map(action => (action.id === id ? { id, start, length } : action)),
			hasChanges: true
		}));
	}

	function addSelectedActions(...actions) {
		actions = actions.reduce(
			(allActions, action) => (typeof action === 'array' ? [...allActions, ...action] : [...allActions, action]),
			[]
		);

		set(state => ({ selectedActions: Array.from(new Set([...state.selectedActions, ...actions])) }));
	}

	function setSelectedActions(...actions) {
		actions = actions.reduce(
			(allActions, action) => (typeof action === 'array' ? [...allActions, ...action] : [...allActions, action]),
			[]
		);

		set({ selectedActions: actions });
	}

	function removeSelectedActions(...actions) {
		actions = actions.reduce(
			(allActions, action) => (typeof action === 'array' ? [...allActions, ...action] : [...allActions, action]),
			[]
		);

		set(state => ({ selectedActions: state.selectedActions.filter(action => !actions.includes(action)), hasChanges: true }));
	}

	function clearSelectedActions() {
		set({ selectedActions: [] });
	}

	function moveSelectedActions(offset) {
		set(state => {
			return {
				mouth: state.mouth.map(mapMoveChanges),
				head: state.head.map(mapMoveChanges),
				tail: state.tail.map(mapMoveChanges),
				hasChanges: true
			};

			function mapMoveChanges(action) {
				if (!state.selectedActions.includes(action.id)) return action;

				action.start = Math.max(Math.min(action.start + offset, state.trackEnd - action.length), 0);
				return action;
			}
		});
	}

	function resizeSelectedActions(direction, offset) {
		set(state => {
			return {
				mouth: state.mouth.map(mapMoveChanges),
				head: state.head.map(mapMoveChanges),
				tail: state.tail.map(mapMoveChanges),
				hasChanges: true
			};

			function mapMoveChanges(action) {
				if (!state.selectedActions.includes(action.id)) return action;
				if (direction === 'right') {
					const length = action.length + offset < MIN_ACTION_LENGTH ? MIN_ACTION_LENGTH : action.length + offset;

					if (action.start + length > state.trackEnd) action.length = state.trackEnd - action.length;
					else action.length = length;

					return action;
				} else if (direction === 'left') {
					const start = action.start + offset;
					const length = action.length - offset;

					if (start <= 0) {
						action.start = 0;
						action.length = length + start; // correct overshoot
					} else if (length < MIN_ACTION_LENGTH) {
						action.start = start - (MIN_ACTION_LENGTH - length); // correct overshoot
						action.length = MIN_ACTION_LENGTH;
					} else {
						action.start = start;
						action.length = length;
					}

					return action;
				}
			}
		});
	}

	function deleteSelectedActions() {
		set(state => {
			return {
				mouth: state.mouth.filter(action => !state.selectedActions.includes(action.id)),
				head: state.head.filter(action => !state.selectedActions.includes(action.id)),
				tail: state.tail.filter(action => !state.selectedActions.includes(action.id)),
				hasChanges: true
			};
		});
	}

	function growAction(actionId, toPosition) {
		set(state => {
			return {
				mouth: state.mouth.map(mapActions),
				head: state.head.map(mapActions),
				tail: state.tail.map(mapActions),
				hasChanges: true
			};

			function mapActions(action) {
				if (actionId !== action.id) return action;

				action.length = Math.max(toPosition - action.start, MIN_ACTION_LENGTH);
				return action;
			}
		});
	}

	async function exportActions() {
		const state = get();
		const totalActions = ['mouth', 'head', 'tail']
			.reduce(
				(totalActions, track) => {
					let actions = state[track];
					actions = actions
						.reduce((total, current) => {
							total.push({ motor: track, action: 'on', time: current.start });
							total.push({ motor: track, action: 'off', time: current.start + current.length });
							return total;
						}, [])
						.sort((a, b) => a.time - b.time)
						.reduce((total, current) => {
							const last = total.at(-1);
							if (last && last.action === current.action) return total;
							else return [...total, current];
						}, []);

					return [...totalActions, ...actions];
				},
				[{ action: 'stop', time: state.stop }]
			)
			.sort((a, b) => a.time - b.time);

		console.log(totalActions);

		useSongs.getState().saveSong(totalActions);
		set({ hasChanges: false });
	}
});
