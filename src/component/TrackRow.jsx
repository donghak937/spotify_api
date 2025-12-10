import React from 'react';
import '../MainPage.css';

const TrackRow = ({ track, rank, showAlbumInfo = false }) => {
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
        </li>
    );
};

export default TrackRow;
