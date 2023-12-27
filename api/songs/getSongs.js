import fs from 'fs';

export async function getSongs(_, res) {
	const info = fs.readdirSync('songs').reduce((songs, path) => {
		fs.readFileSync;
	});

	const songs = await Promise.all(
		fs
			.readdirSync('songs')
			.map(
				path =>
					new Promise(res =>
						fs.promises
							.readFile('songs/' + path + '/info.json', 'utf8')
							.then(data => res({ ...JSON.parse(data), path }))
					)
			)
	);

	res.status(200).json({ songs });
}
