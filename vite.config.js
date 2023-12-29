import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import express from './plugins/express-plugin';
import { fishController } from './plugins/fish-controller-plugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), express('src/api/express.js'), fishController()],
	server: {
		host: '0.0.0.0'
	}
});
