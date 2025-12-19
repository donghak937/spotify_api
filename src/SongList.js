import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import './MainPage.css';
import { getTracksByGenre, GENRE_CONFIG, searchTracksGlobal } from './spotify';
import SearchBar from './component/SearchBar';
import TrackRow from './component/TrackRow';

// 장르 목록
const GENRES = Object.keys(GENRE_CONFIG);

function SongList({ onAdd, onAddMultiple, onTrackClick }) {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || "";

    const [tracks, setTracks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [sortType, setSortType] = useState("RANK");
    const [selectedGenre, setSelectedGenre] = useState("K-Pop");
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchMode, setIsSearchMode] = useState(!!initialSearch);
    const [totalSearchResults, setTotalSearchResults] = useState(0);
    const songsPerPage = 20;

    // 장르 변경 시 해당 장르의 트랙 가져오기 (검색 모드가 아닐 때만)
    useEffect(() => {
        if (isSearchMode) return;

        const fetchData = async () => {
            setIsLoading(true);
            setTracks([]);
            const genreTracks = await getTracksByGenre(selectedGenre);
            if (genreTracks && genreTracks.length > 0) {
                setTracks(genreTracks.map(t => ({ ...t, genre: selectedGenre })));
            }
            setIsLoading(false);
        };
        fetchData();
    }, [selectedGenre, isSearchMode]);

    // 검색어 입력 시 스포티파이 전체 검색 (전체 가져와서 전체 정렬)
    useEffect(() => {
        if (!searchTerm.trim()) {
            setIsSearchMode(false);
            return;
        }

        setIsSearchMode(true);
        const timer = setTimeout(async () => {
            setIsLoading(true);
            setCurrentPage(1);

            // 200곡 가져오기 (50곡씩 4번 병렬 호출)
            const [r1, r2, r3, r4] = await Promise.all([
                searchTracksGlobal(searchTerm, 50, 0),
                searchTracksGlobal(searchTerm, 50, 50),
                searchTracksGlobal(searchTerm, 50, 100),
                searchTracksGlobal(searchTerm, 50, 150)
            ]);

            const allItems = [
                ...(r1.items || []),
                ...(r2.items || []),
                ...(r3.items || []),
                ...(r4.items || [])
            ];

            // 로컬 필터링: 검색어가 실제로 포함된 것만
            const searchLower = searchTerm.toLowerCase();
            const filtered = allItems.filter(track =>
                track.title.toLowerCase().includes(searchLower) ||
                track.artist.toLowerCase().includes(searchLower) ||
                (track.album && track.album.toLowerCase().includes(searchLower))
            );

            // 중복 제거
            const unique = Array.from(new Map(filtered.map(t => [t.id, t])).values());

            setTracks(unique); // 전체 저장
            setTotalSearchResults(unique.length);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 페이지 리셋 (장르 변경 시에만)
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]);
    }, [selectedGenre]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (e) => setSortType(e.target.value);

    const handleGenreClick = (genre) => {
        setSearchTerm(""); // 검색어 초기화
        setIsSearchMode(false);
        setSelectedGenre(genre);
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 정렬 로직 (검색 모드에서도 작동)
    const sortedTracks = [...tracks].sort((a, b) => {
        switch (sortType) {
            case "TITLE_ASC": return a.title.localeCompare(b.title, 'ko');
            case "TITLE_DESC": return b.title.localeCompare(a.title, 'ko');
            case "ARTIST_ASC": return a.artist.localeCompare(b.artist, 'ko');
            case "ARTIST_DESC": return b.artist.localeCompare(a.artist, 'ko');
            case "ALBUM_ASC": return (a.album || "").localeCompare(b.album || "", 'ko');
            case "POPULARITY_DESC": return (b.popularity || 0) - (a.popularity || 0);
            case "DATE_NEW": return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
            case "DATE_OLD": return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
            default: return 0;
        }
    });

    // 페이지네이션 계산 (검색/장르 모두 동일하게 전체 데이터에서 슬라이싱)
    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = sortedTracks.slice(indexOfFirstSong, indexOfLastSong);
    const totalPages = Math.ceil(sortedTracks.length / songsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleSelectAll = () => {
        if (selectedIds.length === currentSongs.length) setSelectedIds([]);
        else setSelectedIds(currentSongs.map(track => track.id));
    };

    const handleBulkAdd = () => {
        const selectedTracks = currentSongs.filter(t => selectedIds.includes(t.id));
        if (selectedTracks.length > 0) {
            onAddMultiple(selectedTracks);
            setSelectedIds([]);
        }
    };

    return (
        <section className="song-list-section" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="main-section-title" style={{ margin: 0 }}>
                    {isSearchMode
                        ? `🔍 "${searchTerm}" 검색 결과 (${totalSearchResults.toLocaleString()}곡)`
                        : `${GENRE_CONFIG[selectedGenre]?.emoji} ${selectedGenre} (${sortedTracks.length}곡)`
                    }
                </h2>
                {currentSongs.length > 0 && (
                    <div className="bulk-actions" style={{ marginBottom: 0 }}>
                        <button className="main-nav-item" onClick={toggleSelectAll} style={{ marginRight: '15px', color: '#1DB954', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            {selectedIds.length === currentSongs.length ? '전체 해제' : '전체 선택'}
                        </button>
                        <button className="bulk-delete-btn" onClick={handleBulkAdd} disabled={selectedIds.length === 0} style={{ padding: '10px 20px', borderRadius: '20px', background: '#1DB954' }}>
                            선택 추가 ({selectedIds.length})
                        </button>
                    </div>
                )}
            </div>

            {/* 장르 버튼들 */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {GENRES.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleGenreClick(genre)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: (!isSearchMode && selectedGenre === genre) ? '2px solid #1DB954' : '1px solid rgba(255,255,255,0.2)',
                            background: (!isSearchMode && selectedGenre === genre) ? '#1DB954' : 'rgba(255,255,255,0.05)',
                            color: (!isSearchMode && selectedGenre === genre) ? 'white' : '#b3b3b3',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: (!isSearchMode && selectedGenre === genre) ? '600' : '400',
                            transition: 'all 0.2s ease',
                            opacity: isSearchMode ? 0.5 : 1
                        }}
                    >
                        {GENRE_CONFIG[genre]?.emoji} {genre}
                    </button>
                ))}
            </div>

            {/* 현재 장르의 아티스트 목록 표시 */}
            {!isSearchMode && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '15px',
                    fontSize: '13px',
                    color: '#888'
                }}>
                    <span style={{ color: '#1DB954', fontWeight: '600' }}>📌 {selectedGenre} 아티스트: </span>
                    {GENRE_CONFIG[selectedGenre]?.artists?.join(', ')}
                </div>
            )}

            {/* 자유 검색 안내 */}
            <div style={{
                background: 'rgba(29, 185, 84, 0.1)',
                border: '1px solid rgba(29, 185, 84, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <span style={{ color: '#b3b3b3', fontSize: '14px' }}>
                    검색창에 <strong style={{ color: '#1DB954' }}>아무 아티스트나 노래 제목</strong>을 입력하면 스포티파이 전체에서 검색합니다!
                </span>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                sortType={sortType}
                onSortChange={handleSortChange}
            />

            <div style={{ minHeight: '400px', position: 'relative' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#1DB954', fontSize: '20px', zIndex: 10 }}>
                        {isSearchMode ? '🔍 검색 중...' : `${GENRE_CONFIG[selectedGenre]?.emoji} ${selectedGenre} 불러오는 중...`}
                    </div>
                )}

                <ul className="main-chart-list song-list-combined" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '10px 0', marginTop: '20px', opacity: isLoading ? 0.5 : 1 }}>
                    {currentSongs.map((track, i) => (
                        <TrackRow
                            key={`${track.id}-${i}`}
                            track={track}
                            rank={(isSearchMode ? (currentPage - 1) * songsPerPage : indexOfFirstSong) + i + 1}
                            showAlbumInfo={true}
                            selectable={true}
                            selected={selectedIds.includes(track.id)}
                            onSelect={toggleSelection}
                            onAdd={() => onAdd(track)}
                            onClick={() => onTrackClick(track)}
                        />
                    ))}
                    {currentSongs.length === 0 && !isLoading && (
                        <div className="no-result" style={{ padding: '40px', textAlign: 'center', color: '#b3b3b3' }}>
                            {isSearchMode ? '검색 결과가 없습니다. 다른 검색어를 시도해보세요.' : '노래를 불러올 수 없습니다.'}
                        </div>
                    )}
                </ul>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="pagination-btn pagination-arrow" onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Prev</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                            <button key={pageNum} onClick={() => paginate(pageNum)} className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}>{pageNum}</button>
                        );
                    })}
                    <button className="pagination-btn pagination-arrow" onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </section>
    );
}

export default SongList;
