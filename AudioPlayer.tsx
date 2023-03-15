import React, { useState } from 'react';

const AudioPlayer = ({ audioUrl }: any) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlayClick = () => {
		setIsPlaying(true);
	};

	const handlePauseClick = () => {
		setIsPlaying(false);
	};

	return (
		<div>
			<audio
				src={audioUrl}
				autoPlay={isPlaying}
			/>
			<button onClick={handlePlayClick}>Play</button>
			<button onClick={handlePauseClick}>Pause</button>
		</div>
	);
};

export default AudioPlayer;
