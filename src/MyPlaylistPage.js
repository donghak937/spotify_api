import React from 'react';
import TrackRow from './component/TrackRow';

function MyPlaylistPage({ playlist, onRemove, user, onTrackClick }) {
    if (!user) {
        return (
            <div className="song-list">
                <h2>My Playlist</h2>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '40px', fontSize: '18px' }}>
                    로그인이 필요한 페이지입니다.
                </p>
            </div>
        );
    }
    return (
        <div className="song-list">
            <h2>My Playlist</h2>
            <div className="song-list-container">
                {playlist.length === 0 ? (
                    <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                        No songs added yet. Go to 'Song List' to add some!
                    </p>
                ) : (
                    playlist.map((track, index) => (
                        <TrackRow
                            key={track.id}
                            track={track}
                            index={index}
                            onRemove={() => onRemove(track.id)} // Pass removal handler
                            onClick={() => onTrackClick(track)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MyPlaylistPage;
