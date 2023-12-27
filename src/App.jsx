import AudioPlayer from './components/AudioPlayer';
import MouseStyle from './components/MouseStyle';
import NewSongModal from './components/NewSongModal';
import SongList from './components/SongList';
import SongSettings from './components/SongSettings';
import TrackContainer from './components/TrackContainer';
import { useSongs } from './context/useSongs';

function App() {
	const newSongOpen = useSongs(state => state.newSongOpen);

	return (
		<>
			<MouseStyle />
			<div className="h-dvh w-full px-5 py-2">
				{newSongOpen && <NewSongModal />}
				<div className="flex justify-between mb-5">
					<SongList />
					<SongSettings />
				</div>
				<AudioPlayer />
				<TrackContainer />
			</div>
		</>
	);
}

export default App;
