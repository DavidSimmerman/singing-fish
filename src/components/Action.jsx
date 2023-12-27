import React, { useEffect, useRef } from 'react';
import { useMouseHold } from '../context/useMouseHold';
import { useTracks } from '../context/useTracks';

export default function Action({ id, start, length }) {
	const addSelectedActions = useTracks(state => state.addSelectedActions);
	const setSelectedActions = useTracks(state => state.setSelectedActions);
	const removeSelectedActions = useTracks(state => state.removeSelectedActions);
	const selected = useTracks(state => state.selectedActions).includes(id);
	const moveSelectedActions = useTracks(state => state.moveSelectedActions);
	const resizeSelectedActions = useTracks(state => state.resizeSelectedActions);
	const onMouseHold = useMouseHold(state => state.onMouseHold);

	const initialClickRef = useRef(false);
	const mouseDownRef = useRef(false);
	const lastMousePosRef = useRef(0);

	function onMouseDown(segment, e) {
		mouseDownRef.current = segment;
		lastMousePosRef.current = e.screenX;

		if (segment === 'middle') onMouseHold('grabbing');
		else onMouseHold('col-resize');

		if (selected) initialClickRef.current = true;
		else initialClickRef.current = false;

		if (e.metaKey || e.ctrlKey) {
			addSelectedActions(id);
		} else {
			setSelectedActions(id);
		}
	}

	function onMouseUp() {
		if (initialClickRef.current) {
			removeSelectedActions(id);
		}
	}

	useEffect(() => {
		addEventListener('mousemove', e => {
			if (!mouseDownRef.current) return;
			const segment = mouseDownRef.current;
			const offset = e.screenX - lastMousePosRef.current;
			lastMousePosRef.current = e.screenX;

			if (segment === 'middle') {
				moveSelectedActions(offset);
			} else if (segment === 'right') {
				resizeSelectedActions('right', offset);
			} else if (segment === 'left') {
				resizeSelectedActions('left', offset);
			}
		});

		addEventListener('mouseup', () => (mouseDownRef.current = false));
	}, []);

	return (
		<div
			onMouseUp={onMouseUp}
			className="h-full w-10 bg-orange-500 absolute rounded-2xl overflow-hidden cursor-ew-resize flex"
			style={{ left: start, width: length + 'px' }}
		>
			<div className="w-4 h-full" onMouseDown={e => onMouseDown('left', e)}></div>
			<div
				onMouseDown={e => onMouseDown('middle', e)}
				className="cursor-grab m-auto h-full relative"
				style={{ width: 'calc(100% - 2rem)' }}
			>
				<div
					className={
						'w-full h-3 bg-white rounded-lg absolute bottom-1.5 left-0 right-0 m-auto ' +
						(selected ? 'bg-opacity-90 ' : 'bg-opacity-50')
					}
					style={selected ? { boxShadow: '0 0 5px 2px white' } : {}}
				></div>
			</div>
			<div className="w-4 h-full" onMouseDown={e => onMouseDown('right', e)}></div>
		</div>
	);
}
