import { create } from 'zustand';

export const useMouseHold = create(set => {
	const store = {
		isMouseDown: false,
		onMouseHold
	};

	addEventListener('mouseup', () => {
		set({ isMouseDown: false });
		document.body.style.cursor = '';
	});

	return store;

	function onMouseHold(cursorStyle) {
		set({ isMouseDown: true });
		document.body.style.cursor = cursorStyle;
	}
});
