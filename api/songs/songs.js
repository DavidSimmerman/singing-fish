import fs from 'fs';

export * from './deleteSong';
export * from './getSongs';
export * from './newSong';
export * from './saveSong';

if (!fs.existsSync('songs')) {
	fs.mkdirSync('songs');
}
