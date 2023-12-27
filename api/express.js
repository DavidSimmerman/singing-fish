import express from 'express';
import { getAudioFile } from './audio/audio';
import { deleteSong, getSongs, newSong, saveSong } from './songs/songs';

export const expressApp = express();
expressApp.use(express.json());
expressApp.disable('etag');

expressApp.get('/api/songs', getSongs);
expressApp.post('/api/songs', newSong);
expressApp.delete('/api/songs', deleteSong);
expressApp.put('/api/songs', saveSong);

expressApp.get('/audio/:song', getAudioFile);
