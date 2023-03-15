import hark from 'hark';
import { useState, useEffect } from 'react';
import { startRecording, saveRecording } from '../handlers/recorder-controls';
import {
	Recorder,
	Interval,
	AudioTrack,
	MediaRecorderEvent,
} from '../types/recorder';

const initialState: Recorder = {
	recordingMinutes: 0,
	recordingSeconds: 0,
	initRecording: false,
	mediaStream: null,
	mediaRecorder: null,
	audio: null,
};

export default function useRecorder() {
	const [recorderState, setRecorderState] = useState<Recorder>(initialState);
	//
	//hark controller
	const [harker, setHarker] = useState<any>(null);

	//set timer
	useEffect(() => {
		const MAX_RECORDER_TIME = 5;
		let recordingInterval: Interval = null;

		if (recorderState.initRecording)
			recordingInterval = setInterval(() => {
				setRecorderState((prevState: Recorder) => {
					if (
						prevState.recordingMinutes === MAX_RECORDER_TIME &&
						prevState.recordingSeconds === 0
					) {
						typeof recordingInterval === 'number' &&
							clearInterval(recordingInterval);
						return prevState;
					}

					if (
						prevState.recordingSeconds >= 0 &&
						prevState.recordingSeconds < 59
					)
						return {
							...prevState,
							recordingSeconds: prevState.recordingSeconds + 1,
						};
					else if (prevState.recordingSeconds === 59)
						return {
							...prevState,
							recordingMinutes: prevState.recordingMinutes + 1,
							recordingSeconds: 0,
						};
					else return prevState;
				});
			}, 1000);
		else
			typeof recordingInterval === 'number' && clearInterval(recordingInterval);

		return () => {
			typeof recordingInterval === 'number' && clearInterval(recordingInterval);
		};
	});

	//if audio is playing then it runthe function
	useEffect(() => {
		setRecorderState(prevState => {
			if (prevState.mediaStream)
				return {
					...prevState,
					mediaRecorder: new MediaRecorder(prevState.mediaStream),
				};
			else return prevState;
		});
	}, [recorderState.mediaStream]);

	useEffect(() => {
		const recorder = recorderState.mediaRecorder;
		let chunks: Blob[] = [];

		if (recorder && recorder.state === 'inactive') {
			recorder.start();

			//audio visualiser
			recorder.ondataavailable = (e: MediaRecorderEvent) => {
				chunks.push(e.data);
			};

			//hark control if the user is silence
			const harkOptions = {
				interval: 100,
				threshold: -65,
			};

			const speechEvents = hark(recorderState.mediaStream!, harkOptions);
			setHarker(speechEvents);

			speechEvents.on('speaking', () => {});

			speechEvents.on('stopped_speaking', () => {
				saveRecording(recorderState.mediaRecorder);
				startRecording(setRecorderState);
				// Save the mini chunk of the recording
				// let miniChunks: Blob[] = [];
				// miniChunks = chunks;
				// console.log('chunk', chunks);
				// console.log('mini', miniChunks);

				// const miniBlob = new Blob(miniChunks, { type: 'audio/wav' });

				// setMiniRecorderState((prevState: Recorder) => {
				// 	return {
				// 		...prevState,
				// 		audio: window.URL.createObjectURL(miniBlob),
				// 	};
				// });

				// miniChunks = [];
			});

			//when it stop it save
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: 'audio/wav' });
				chunks = [];
				setRecorderState((prevState: Recorder) => {
					if (prevState.mediaRecorder)
						return {
							...initialState,
							audio: window.URL.createObjectURL(blob),
						};
					else return initialState;
				});
			};
		}

		return () => {
			if (recorder)
				recorder.stream
					.getAudioTracks()
					.forEach((track: AudioTrack) => track.stop());
		};
	}, [recorderState.mediaRecorder]);

	return {
		recorderState,
		setRecorderState,
		startRecording: () => startRecording(setRecorderState),
		cancelRecording: () => setRecorderState(initialState),
		saveRecording: () => saveRecording(recorderState.mediaRecorder),
	};
}
