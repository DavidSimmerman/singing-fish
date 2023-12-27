import { expressApp } from '../api/express';

const EXPRESS_ENDPOINTS = ['api', 'audio'];

export default function express() {
	return {
		name: 'vite-express',
		configureServer: async server => {
			server.middlewares.use(async (req, res, next) => {
				try {
					if (EXPRESS_ENDPOINTS.includes(req.url.split('/')?.[1])) {
						await new Promise(resolve => {
							expressApp(req, res, resolve);
						});

						if (!res.headersSent) res.status(404).send('API not found');
					} else {
						next();
					}
				} catch (err) {
					console.error(err);
				}
			});
		}
	};
}
