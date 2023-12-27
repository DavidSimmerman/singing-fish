import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from './plugins/express-plugin';
import { fishController } from './plugins/fish-controller-plugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), express('src/api/express.js'), fishController()]
});
