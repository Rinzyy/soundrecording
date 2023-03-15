import { DeleteOutline } from '@mui/icons-material';
import { useState } from 'react';
import useRecordingsList from '../../hooks/use-recordings-list';
import { Audio, RecordingsListProps } from '../../types/recorder';

export default function RecordingsList({ audio }: RecordingsListProps) {
	const { recordings, deleteAudio } = useRecordingsList(audio);
	const [url, setURL] = useState('');

	async function mergeBlobs(allRecord: Audio[]) {
		const blobUrls = allRecord.map(obj => obj.audio);
		const blobs = await Promise.all(
			blobUrls.map(url => fetch(url).then(res => res.blob()))
		);
		const buffers = await Promise.all(blobs.map(blob => blob.arrayBuffer()));
		const mergedBlob = new Blob(buffers, { type: 'audio/wav' }); // or use the appropriate MIME type for your audio format
		const mergedUrl = window.URL.createObjectURL(mergedBlob);
		setURL(mergedUrl);
	}

	return (
		<div className="recordings-container">
			{recordings.length > 0 ? (
				<>
					<h1>Your recordings</h1>
					<div className="recordings-list">
						{recordings.map(record => (
							<div
								className="record"
								key={record.key}>
								<audio
									controls
									src={record.audio}
								/>
								<div className="delete-button-container">
									<button
										className="delete-button"
										title="Delete this audio"
										onClick={() => deleteAudio(record.key)}>
										<DeleteOutline />
									</button>
								</div>
							</div>
						))}
						<div className="record">
							<button onClick={() => mergeBlobs(recordings)}>Click</button>
							<audio
								controls
								preload="auto"
								src={url}
							/>
						</div>
					</div>
				</>
			) : (
				<div className="no-records">
					<span>You don't have records</span>
				</div>
			)}
		</div>
	);
}
