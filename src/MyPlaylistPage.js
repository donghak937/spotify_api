import React, { useState, useMemo } from 'react';
import TrackRow from './component/TrackRow';
import SearchBar from './component/SearchBar';

function MyPlaylistPage({ playlist, memos, onRemove, onRemoveMultiple, user, onTrackClick }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('ADDED');

    const filteredAndSortedPlaylist = useMemo(() => {
        let result = [...playlist];

        // Search
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(track =>
                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                (track.album && track.album.toLowerCase().includes(query))
            );
        }

        // Sort
        result.sort((a, b) => {
            switch (sortType) {
                case "TITLE_ASC":
                    return a.title.localeCompare(b.title);
                case "TITLE_DESC":
                    return b.title.localeCompare(a.title);
                case "ARTIST_ASC":
                    return a.artist.localeCompare(b.artist);
                case "ARTIST_DESC":
                    return b.artist.localeCompare(a.artist);
                case "ALBUM_ASC":
                    return (a.album || "").localeCompare(b.album || "");
                case "POPULARITY_DESC":
                    return (b.popularity || 0) - (a.popularity || 0);
                case "DATE_NEW":
                    return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
                case "DATE_OLD":
                    return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
                case "ADDED":
                default:
                    return 0; // Maintain original added order
            }
        });

        return result;
    }, [playlist, searchTerm, sortType]);

    if (!user) {
        return (
            <div className="song-list">
                <h2 className="main-section-title">My Playlist</h2>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '40px', fontSize: '18px' }}>
                    로그인이 필요한 페이지입니다.
                </p>
            </div>
        );
    }

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (window.confirm(`${selectedIds.length}개의 곡을 삭제하시겠습니까?`)) {
            onRemoveMultiple(selectedIds);
            setSelectedIds([]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredAndSortedPlaylist.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredAndSortedPlaylist.map(track => track.id));
        }
    };

    return (
        <section className="song-list-section" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="main-section-title" style={{ margin: 0 }}>My Playlist</h2>
                {playlist.length > 0 && (
                    <div className="bulk-actions" style={{ marginBottom: 0 }}>
                        <button
                            className="main-nav-item"
                            onClick={toggleSelectAll}
                            style={{ marginRight: '15px', color: '#1DB954', cursor: 'pointer', background: 'transparent', border: 'none' }}
                        >
                            {selectedIds.length === filteredAndSortedPlaylist.length ? '전체 해제' : '전체 선택'}
                        </button>
                        <button
                            className="bulk-delete-btn"
                            onClick={handleBulkDelete}
                            disabled={selectedIds.length === 0}
                            style={{ padding: '10px 20px', borderRadius: '20px' }}
                        >
                            선택 삭제 ({selectedIds.length})
                        </button>
                    </div>
                )}
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                sortType={sortType}
                onSortChange={(e) => setSortType(e.target.value)}
            />

            <div className="song-list-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '10px 0', marginTop: '20px' }}>
                {filteredAndSortedPlaylist.length === 0 ? (
                    <div className="no-result" style={{ padding: '40px' }}>
                        {searchTerm ? '검색 결과가 없습니다.' : "담긴 곡이 없습니다. '노래 목록'에서 곡을 추가해보세요!"}
                    </div>
                ) : (
                    <ul className="main-chart-list">
                        {filteredAndSortedPlaylist.map((track, index) => (
                            <TrackRow
                                key={track.id}
                                track={track}
                                rank={index + 1}
                                selectable={true}
                                selected={selectedIds.includes(track.id)}
                                onSelect={toggleSelection}
                                memo={memos ? memos[track.id] : ''}
                                onRemove={() => onRemove(track.id)}
                                onClick={() => onTrackClick(track)}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default MyPlaylistPage;
