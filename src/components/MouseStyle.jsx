import React from 'react';
import { useMouseHold } from '../context/useMouseHold';

export default function MouseStyle() {
	const isMouseDown = useMouseHold(state => state.isMouseDown);

	return <style>{isMouseDown && '[class*="cursor"] { cursor: inherit !important }'}</style>;
}
