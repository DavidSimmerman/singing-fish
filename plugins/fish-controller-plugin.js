import FishController from '../fishController/fishController';

export function fishController() {
	return {
		name: 'fish-controller',
		configureServer: () => {
			if (FishController.active) console.log('Fish controller active.');
			else console.log('Fish controller inactive.');
		}
	};
}
