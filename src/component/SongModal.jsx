import React from 'react';
import '../MainPage.css';

const SongModal = ({ track, onClose, user, memo = "", onSaveMemo, isSaved, onTogglePlaylist }) => {
    const [currentMemo, setCurrentMemo] = React.useState(memo);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        setCurrentMemo(memo);
    }, [memo]);

    if (!track) return null;

    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    const handleSave = () => {
        if (onSaveMemo) {
            onSaveMemo(track.id, currentMemo);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentMemo(memo);
        setIsEditing(false);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {/* Left Side: Image */}
                <div className="modal-img-wrap">
                    <img src={track.cover} alt={track.title} className="modal-img" />
                </div>

                {/* Right Side: Info & Memo */}
                <div className="modal-info">
                    <h2 className="modal-title">{track.title}</h2>
                    <p className="modal-artist">{track.artist}</p>

                    <div className="modal-details">
                        {track.album && <p className="modal-detail-item"><strong>Album:</strong> {track.album}</p>}
                        {track.releaseDate && <p className="modal-detail-item"><strong>Release:</strong> {track.releaseDate}</p>}
                        {track.duration && <p className="modal-detail-item"><strong>Duration:</strong> {formatTime(track.duration)}</p>}
                        {track.popularity !== undefined && <p className="modal-detail-item"><strong>Popularity:</strong> {track.popularity}%</p>}
                    </div>

                    <div className="modal-btn-group">
                        <button
                            className={`btn-icon ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={onTogglePlaylist}
                        >
                            {isSaved ? '💔 Remove' : '❤️ Add to Playlist'}
                        </button>
                    </div>

                    <div className="modal-memo-section">
                        <div className="modal-memo-title-wrap">
                            <h3 className="modal-memo-title">📝 My Memo</h3>
                            {user && !isEditing && (
                                <button className="modal-memo-btn" onClick={() => setIsEditing(true)}>Edit</button>
                            )}
                        </div>

                        {user ? (
                            isEditing ? (
                                <>
                                    <textarea
                                        className="modal-memo-input"
                                        value={currentMemo}
                                        onChange={(e) => setCurrentMemo(e.target.value)}
                                        placeholder="Write your thoughts about this song..."
                                        autoFocus
                                    />
                                    <div className="memo-actions">
                                        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                                        <button className="btn-save" onClick={handleSave}>Save</button>
                                    </div>
                                </>
                            ) : (
                                <div className="modal-memo-display">
                                    {currentMemo ? currentMemo : <span style={{ color: '#666' }}>No memo yet. Click edit to add one.</span>}
                                </div>
                            )
                        ) : (
                            <div className="modal-memo-display" style={{ color: '#b3b3b3' }}>
                                <a href="/login" style={{ color: '#1db954', textDecoration: 'none' }}>Log in</a> to write memos.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongModal;
