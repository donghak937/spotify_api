/**
 * @file SongList.js
 * @description 노래 목록 페이지 - 장르별 탐색 및 전체 검색 기능
 * 
 * 이 페이지에서 제공하는 기능:
 * 1. 장르별 음악 탐색 (K-Pop, Hip-Hop, R&B, 발라드 등)
 * 2. Spotify 전체 라이브러리 검색
 * 3. 다양한 정렬 옵션 (제목, 가수, 발매일, 인기도 등)
 * 4. 페이지네이션
 * 5. 다중 선택 후 플레이리스트 일괄 추가
 */

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import './MainPage.css';

// Spotify API 함수들
import { getTracksByGenre, GENRE_CONFIG, searchTracksGlobal } from './spotify';

// 컴포넌트
import SearchBar from './component/SearchBar';    // 검색 및 정렬 바
import TrackRow from './component/TrackRow';      // 트랙 행 아이템

/**
 * 사용 가능한 장르 목록
 * GENRE_CONFIG 객체의 키들을 배열로 변환
 * 결과: ['K-Pop', 'Hip-Hop', 'R&B', '발라드', '인디/록', 'EDM', 'OST']
 */
const GENRES = Object.keys(GENRE_CONFIG);

/**
 * SongList 컴포넌트
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onAdd - 단일 곡을 플레이리스트에 추가하는 핸들러
 * @param {Function} props.onAddMultiple - 여러 곡을 플레이리스트에 추가하는 핸들러
 * @param {Function} props.onTrackClick - 트랙 클릭 시 모달을 여는 핸들러
 * @returns {JSX.Element} 노래 목록 페이지 컴포넌트
 */
function SongList({ onAdd, onAddMultiple, onTrackClick }) {
    // ============================================================
    // ==================== URL 파라미터 처리 ======================
    // ============================================================

    /**
     * URL 쿼리 파라미터 가져오기
     * 
     * 예: /songs?search=BTS 로 접근하면 initialSearch = "BTS"
     * 홈페이지의 키워드/아티스트 클릭 시 이 방식으로 검색어가 전달됨
     */
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || "";

    // ============================================================
    // ======================== 상태 정의 ==========================
    // ============================================================

    /**
     * 현재 표시할 트랙 목록
     * @type {Array<Track>}
     */
    const [tracks, setTracks] = useState([]);

    /**
     * 검색어 상태
     * - URL 파라미터가 있으면 초기값으로 설정
     * - 사용자 입력에 따라 실시간 업데이트
     */
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    /**
     * 정렬 기준
     * @type {string}
     * 가능한 값: RANK, TITLE_ASC, TITLE_DESC, ARTIST_ASC, ARTIST_DESC,
     *           ALBUM_ASC, POPULARITY_DESC, DATE_NEW, DATE_OLD
     */
    const [sortType, setSortType] = useState("RANK");

    /**
     * 선택된 장르
     * @type {string}
     * 기본값: "K-Pop"
     */
    const [selectedGenre, setSelectedGenre] = useState("K-Pop");

    /**
     * 체크박스로 선택된 트랙 ID들
     * @type {Array<string>}
     * 다중 선택 추가 기능에 사용
     */
    const [selectedIds, setSelectedIds] = useState([]);

    /**
     * 현재 페이지 번호
     * @type {number}
     * 1부터 시작
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * 로딩 상태
     * @type {boolean}
     * true: 데이터 로딩 중, false: 로딩 완료
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 검색 모드 여부
     * @type {boolean}
     * true: 검색 결과 표시, false: 장르별 트랙 표시
     */
    const [isSearchMode, setIsSearchMode] = useState(!!initialSearch);

    /**
     * 전체 검색 결과 수
     * @type {number}
     * 검색 모드에서 표시용
     */
    const [totalSearchResults, setTotalSearchResults] = useState(0);

    /**
     * 페이지당 곡 수
     * @constant {number}
     */
    const songsPerPage = 20;

    // ============================================================
    // =================== 장르별 데이터 로딩 ======================
    // ============================================================

    /**
     * 장르 변경 시 해당 장르의 트랙 가져오기
     * 
     * - 검색 모드가 아닐 때만 실행
     * - selectedGenre가 변경될 때마다 새 데이터 로드
     */
    useEffect(() => {
        // 검색 모드면 이 효과 무시
        if (isSearchMode) return;

        const fetchData = async () => {
            setIsLoading(true);
            setTracks([]);  // 기존 트랙 초기화 (새 장르 로딩 전)

            // Spotify API에서 해당 장르의 트랙 가져오기
            const genreTracks = await getTracksByGenre(selectedGenre);

            if (genreTracks && genreTracks.length > 0) {
                // 트랙에 장르 정보 추가
                setTracks(genreTracks.map(t => ({ ...t, genre: selectedGenre })));
            }

            setIsLoading(false);
        };
        fetchData();
    }, [selectedGenre, isSearchMode]);  // 장르 또는 모드 변경 시 재실행

    // ============================================================
    // ===================== 검색 기능 처리 ========================
    // ============================================================

    /**
     * 검색어 입력 시 스포티파이 전체 검색
     * 
     * 디바운스 적용: 입력 후 500ms 대기 후 검색 실행
     * (너무 빈번한 API 호출 방지)
     */
    useEffect(() => {
        // 검색어가 비어있으면 검색 모드 해제
        if (!searchTerm.trim()) {
            setIsSearchMode(false);
            return;
        }

        // 검색 모드 활성화
        setIsSearchMode(true);

        /**
         * 디바운스 타이머
         * 
         * 500ms 동안 추가 입력이 없으면 검색 실행
         * 추가 입력이 있으면 타이머 리셋 (cleanup 함수에서 처리)
         */
        const timer = setTimeout(async () => {
            setIsLoading(true);
            setCurrentPage(1);  // 검색 시 첫 페이지로 리셋

            /**
             * 200곡 병렬 가져오기
             * 
             * Spotify API는 한 번에 최대 50곡까지만 반환하므로
             * 4번 병렬 호출하여 총 200곡 가져오기
             */
            const [r1, r2, r3, r4] = await Promise.all([
                searchTracksGlobal(searchTerm, 50, 0),    // 1~50
                searchTracksGlobal(searchTerm, 50, 50),   // 51~100
                searchTracksGlobal(searchTerm, 50, 100),  // 101~150
                searchTracksGlobal(searchTerm, 50, 150)   // 151~200
            ]);

            // 모든 결과 병합
            const allItems = [
                ...(r1.items || []),
                ...(r2.items || []),
                ...(r3.items || []),
                ...(r4.items || [])
            ];

            /**
             * 로컬 필터링
             * 
             * API 검색 결과가 정확하지 않을 수 있으므로
             * 검색어가 제목, 아티스트, 앨범에 실제로 포함된 것만 필터링
             */
            const searchLower = searchTerm.toLowerCase();
            const filtered = allItems.filter(track =>
                track.title.toLowerCase().includes(searchLower) ||
                track.artist.toLowerCase().includes(searchLower) ||
                (track.album && track.album.toLowerCase().includes(searchLower))
            );

            /**
             * 중복 제거
             * 
             * 같은 ID의 트랙이 여러 번 나올 수 있으므로
             * Map을 사용해 ID 기준 중복 제거
             */
            const unique = Array.from(new Map(filtered.map(t => [t.id, t])).values());

            setTracks(unique);  // 필터링된 전체 결과 저장
            setTotalSearchResults(unique.length);
            setIsLoading(false);
        }, 500);  // 500ms 디바운스

        // Cleanup: 타이머 취소 (새 입력이 들어오면 기존 타이머 제거)
        return () => clearTimeout(timer);
    }, [searchTerm]);  // searchTerm 변경 시 재실행

    // ============================================================
    // ====================== 페이지 리셋 ==========================
    // ============================================================

    /**
     * 장르 변경 시 페이지와 선택 초기화
     */
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]);
    }, [selectedGenre]);

    // ============================================================
    // ===================== 이벤트 핸들러 =========================
    // ============================================================

    /**
     * 검색어 변경 핸들러
     * @param {Event} e - 입력 이벤트
     */
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    /**
     * 정렬 옵션 변경 핸들러
     * @param {Event} e - select 변경 이벤트
     */
    const handleSortChange = (e) => setSortType(e.target.value);

    /**
     * 장르 버튼 클릭 핸들러
     * 
     * 검색어를 초기화하고 검색 모드를 해제한 후
     * 선택한 장르로 변경
     * 
     * @param {string} genre - 선택한 장르 이름
     */
    const handleGenreClick = (genre) => {
        setSearchTerm("");  // 검색어 초기화
        setIsSearchMode(false);
        setSelectedGenre(genre);
    };

    /**
     * 체크박스 선택 토글
     * 
     * @param {string} id - 트랙 ID
     */
    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)  // 이미 선택되어 있으면 제거
                : [...prev, id]                      // 선택되어 있지 않으면 추가
        );
    };

    // ============================================================
    // ======================= 정렬 로직 ===========================
    // ============================================================

    /**
     * 정렬된 트랙 배열
     * 
     * sortType에 따라 다른 정렬 로직 적용
     * localeCompare('ko')를 사용해 한글 정렬 지원
     */
    const sortedTracks = [...tracks].sort((a, b) => {
        switch (sortType) {
            case "TITLE_ASC":
                return a.title.localeCompare(b.title, 'ko');     // 제목 가나다순
            case "TITLE_DESC":
                return b.title.localeCompare(a.title, 'ko');     // 제목 역순
            case "ARTIST_ASC":
                return a.artist.localeCompare(b.artist, 'ko');   // 가수 가나다순
            case "ARTIST_DESC":
                return b.artist.localeCompare(a.artist, 'ko');   // 가수 역순
            case "ALBUM_ASC":
                return (a.album || "").localeCompare(b.album || "", 'ko');  // 앨범 가나다순
            case "POPULARITY_DESC":
                return (b.popularity || 0) - (a.popularity || 0);  // 인기도 높은순
            case "DATE_NEW":
                return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);  // 발매일 최신순
            case "DATE_OLD":
                return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);  // 발매일 오래된순
            default:
                return 0;  // 기본 (랭킹순, 변경 없음)
        }
    });

    // ============================================================
    // =================== 페이지네이션 계산 =======================
    // ============================================================

    // 현재 페이지의 마지막 곡 인덱스
    const indexOfLastSong = currentPage * songsPerPage;

    // 현재 페이지의 첫 번째 곡 인덱스
    const indexOfFirstSong = indexOfLastSong - songsPerPage;

    // 현재 페이지에 표시할 곡들
    const currentSongs = sortedTracks.slice(indexOfFirstSong, indexOfLastSong);

    // 전체 페이지 수
    const totalPages = Math.ceil(sortedTracks.length / songsPerPage);

    /**
     * 페이지 변경 핸들러
     * @param {number} pageNumber - 이동할 페이지 번호
     */
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // ============================================================
    // ===================== 다중 선택 기능 ========================
    // ============================================================

    /**
     * 전체 선택/해제 토글
     * 
     * 모두 선택되어 있으면 전체 해제,
     * 하나라도 선택되어 있지 않으면 전체 선택
     */
    const toggleSelectAll = () => {
        if (selectedIds.length === currentSongs.length) {
            setSelectedIds([]);  // 전체 해제
        } else {
            setSelectedIds(currentSongs.map(track => track.id));  // 전체 선택
        }
    };

    /**
     * 선택된 곡들 플레이리스트에 추가
     * 
     * 선택된 ID에 해당하는 트랙들을 찾아 onAddMultiple 호출
     */
    const handleBulkAdd = () => {
        const selectedTracks = currentSongs.filter(t => selectedIds.includes(t.id));
        if (selectedTracks.length > 0) {
            onAddMultiple(selectedTracks);
            setSelectedIds([]);  // 선택 초기화
        }
    };

    // ============================================================
    // ========================= 렌더링 ============================
    // ============================================================

    return (
        <section className="song-list-section" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 40px' }}>
            {/* ========== 섹션 헤더 (제목 + 버튼) ========== */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* 제목: 검색 모드 / 장르 모드에 따라 다른 텍스트 표시 */}
                <h2 className="main-section-title" style={{ margin: 0 }}>
                    {isSearchMode
                        ? `🔍 "${searchTerm}" 검색 결과 (${totalSearchResults.toLocaleString()}곡)`
                        : `${GENRE_CONFIG[selectedGenre]?.emoji} ${selectedGenre} (${sortedTracks.length}곡)`
                    }
                </h2>

                {/* 다중 선택 액션 버튼들 */}
                {currentSongs.length > 0 && (
                    <div className="bulk-actions" style={{ marginBottom: 0 }}>
                        {/* 전체 선택/해제 버튼 */}
                        <button
                            className="main-nav-item"
                            onClick={toggleSelectAll}
                            style={{ marginRight: '15px', color: '#1DB954', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            {selectedIds.length === currentSongs.length ? '전체 해제' : '전체 선택'}
                        </button>

                        {/* 선택 추가 버튼 */}
                        <button
                            className="bulk-delete-btn"
                            onClick={handleBulkAdd}
                            disabled={selectedIds.length === 0}
                            style={{ padding: '10px 20px', borderRadius: '20px', background: '#1DB954' }}
                        >
                            선택 추가 ({selectedIds.length})
                        </button>
                    </div>
                )}
            </div>

            {/* ========== 장르 선택 버튼들 ========== */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {GENRES.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleGenreClick(genre)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '25px',
                            // 선택된 장르: 초록색 테두리와 배경
                            border: (!isSearchMode && selectedGenre === genre) ? '2px solid #1DB954' : '1px solid rgba(255,255,255,0.2)',
                            background: (!isSearchMode && selectedGenre === genre) ? '#1DB954' : 'rgba(255,255,255,0.05)',
                            color: (!isSearchMode && selectedGenre === genre) ? 'white' : '#b3b3b3',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: (!isSearchMode && selectedGenre === genre) ? '600' : '400',
                            transition: 'all 0.2s ease',
                            // 검색 모드일 때 장르 버튼 흐리게 표시
                            opacity: isSearchMode ? 0.5 : 1
                        }}
                    >
                        {GENRE_CONFIG[genre]?.emoji} {genre}
                    </button>
                ))}
            </div>

            {/* ========== 현재 장르의 아티스트 목록 표시 ========== */}
            {/* 검색 모드가 아닐 때만 표시 */}
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

            {/* ========== 자유 검색 안내 배너 ========== */}
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

            {/* ========== 검색 및 정렬 바 ========== */}
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                sortType={sortType}
                onSortChange={handleSortChange}
            />

            {/* ========== 트랙 리스트 영역 ========== */}
            <div style={{ minHeight: '400px', position: 'relative' }}>
                {/* 로딩 인디케이터 */}
                {isLoading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#1DB954', fontSize: '20px', zIndex: 10 }}>
                        {isSearchMode ? '🔍 검색 중...' : `${GENRE_CONFIG[selectedGenre]?.emoji} ${selectedGenre} 불러오는 중...`}
                    </div>
                )}

                {/* 트랙 리스트 */}
                <ul className="main-chart-list song-list-combined" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '10px 0', marginTop: '20px', opacity: isLoading ? 0.5 : 1 }}>
                    {currentSongs.map((track, i) => (
                        <TrackRow
                            key={`${track.id}-${i}`}   // 고유 키 (동일 ID 중복 방지)
                            track={track}              // 트랙 데이터
                            rank={(isSearchMode ? (currentPage - 1) * songsPerPage : indexOfFirstSong) + i + 1}  // 순위 계산
                            showAlbumInfo={true}       // 앨범 정보 표시
                            selectable={true}          // 체크박스 표시
                            selected={selectedIds.includes(track.id)}  // 선택 상태
                            onSelect={toggleSelection}  // 체크박스 변경 핸들러
                            onAdd={() => onAdd(track)}  // + 버튼 클릭 핸들러
                            onClick={() => onTrackClick(track)}  // 행 클릭 핸들러 (모달)
                        />
                    ))}

                    {/* 결과 없음 메시지 */}
                    {currentSongs.length === 0 && !isLoading && (
                        <div className="no-result" style={{ padding: '40px', textAlign: 'center', color: '#b3b3b3' }}>
                            {isSearchMode ? '검색 결과가 없습니다. 다른 검색어를 시도해보세요.' : '노래를 불러올 수 없습니다.'}
                        </div>
                    )}
                </ul>
            </div>

            {/* ========== 페이지네이션 ========== */}
            {totalPages > 1 && (
                <div className="pagination">
                    {/* 이전 페이지 버튼 */}
                    <button
                        className="pagination-btn pagination-arrow"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {/* 페이지 번호 버튼들 (최대 5개 표시) */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        // 페이지 번호 계산 로직 (현재 페이지 주변 5개)
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* 다음 페이지 버튼 */}
                    <button
                        className="pagination-btn pagination-arrow"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}

export default SongList;
