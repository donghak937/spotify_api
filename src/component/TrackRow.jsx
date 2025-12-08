import React from 'react';
import '../MainPage.css';

const TrackRow = ({ track, rank, showAlbumInfo = false, onAdd, onRemove }) => {
    return (
        <li className="main-track-row">
            <div className="main-track-rank">
                {rank}
            </div>

            <div className="main-track-cover-wrap">
                <img
                    className="main-track-cover"
                    src={track.cover}
                    alt={track.title}
                />
                <button className="main-track-play">▶</button>
            </div>

            <div className="main-track-meta">
                <div className="main-track-title">{track.title}</div>
                <div className="main-track-artist">{track.artist}</div>
                {showAlbumInfo && (
                    <div className="main-track-album-info">
                        {track.album && <span className="track-album">💿 {track.album} </span>}
                        {track.releaseDate && <span className="track-date">📅 {track.releaseDate}</span>}
                    </div>
                )}
            </div>

            <div className="main-track-actions">
                {onAdd && (
                    <button className="add-btn" onClick={onAdd} style={{
                        background: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }}>+</button>
                )}
                {onRemove && (
                    <button className="remove-btn" onClick={onRemove} style={{
                        background: 'transparent',
                        border: '1px solid #e91e63',
                        color: '#e91e63',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }}>-</button>
                )}
            </div>
        </li>
    );
};

export default TrackRow;
