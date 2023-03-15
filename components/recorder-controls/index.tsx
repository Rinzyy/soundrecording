import { formatMinutes, formatSeconds } from '../../utils/format-time';
import { RecorderControlsProps } from '../../types/recorder';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { useEffect, useState } from 'react';
import hark from 'hark';
export default function RecorderControls({
	recorderState,
	handlers,
}: RecorderControlsProps) {
	const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
	const { startRecording, saveRecording, cancelRecording } = handlers;

	return (
		<div className="controls-container flex flex-row gap-2">
			<div className="recorder-display flex flex-row gap-2 ">
				{initRecording && (
					<div className="cancel-button-container">
						<button
							className="cancel-button"
							title="Cancel recording"
							onClick={cancelRecording}>
							<AccessTimeFilledIcon />
						</button>
					</div>
				)}
				<div className="recording-time">
					{initRecording && <div className="recording-indicator"></div>}
					<span>{formatMinutes(recordingMinutes)}</span>
					<span>:</span>
					<span>{formatSeconds(recordingSeconds)}</span>
				</div>
			</div>
			<div className="start-button-container">
				{initRecording ? (
					<button
						className="start-button"
						title="Save recording"
						disabled={recordingSeconds === 0}
						onClick={saveRecording}>
						<SaveIcon />
					</button>
				) : (
					<button
						className="start-button"
						title="Start recording"
						onClick={startRecording}>
						<KeyboardVoiceIcon />
					</button>
				)}
			</div>
		</div>
	);
}
