/**
 * @file MyPlaylistPage.js
 * @description 내 플레이리스트 페이지 - 사용자가 저장한 곡들을 관리
 * 
 * 이 페이지에서 제공하는 기능:
 * 1. 저장된 플레이리스트 목록 표시
 * 2. 곡 검색 및 정렬
 * 3. 개별/다중 곡 삭제
 * 4. 각 곡의 메모 표시
 * 5. 비로그인 시 안내 메시지 표시
 */

import React, { useState, useMemo } from 'react';

// 컴포넌트
import TrackRow from './component/TrackRow';     // 트랙 행 아이템
import SearchBar from './component/SearchBar';   // 검색 및 정렬 바

/**
 * MyPlaylistPage 컴포넌트
 * 
 * 사용자의 개인 플레이리스트를 표시하고 관리하는 페이지
 * 
 * @component
 * @param {Object} props
 * @param {Array<Track>} props.playlist - 사용자의 플레이리스트 데이터
 * @param {Object} props.memos - 곡별 메모 데이터 ({ trackId: "메모 내용" })
 * @param {Function} props.onRemove - 단일 곡 삭제 핸들러 (trackId) => void
 * @param {Function} props.onRemoveMultiple - 다중 곡 삭제 핸들러 (trackIds[]) => void
 * @param {Object|null} props.user - 현재 로그인한 사용자 (null이면 비로그인)
 * @param {Function} props.onTrackClick - 트랙 클릭 시 모달을 여는 핸들러
 * @returns {JSX.Element} 플레이리스트 페이지 컴포넌트
 */
function MyPlaylistPage({ playlist, memos, onRemove, onRemoveMultiple, user, onTrackClick }) {
    // ============================================================
    // ======================== 상태 정의 ==========================
    // ============================================================

    /**
     * 체크박스로 선택된 트랙 ID들
     * @type {Array<string>}
     * 다중 선택 삭제 기능에 사용
     */
    const [selectedIds, setSelectedIds] = useState([]);

    /**
     * 검색어 상태
     * @type {string}
     * 플레이리스트 내 검색에 사용
     */
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * 정렬 기준
     * @type {string}
     * 기본값: 'ADDED' (추가된 순서)
     */
    const [sortType, setSortType] = useState('ADDED');

    // ============================================================
    // ================ 검색 및 정렬 로직 (useMemo) ================
    // ============================================================

    /**
     * 필터링 및 정렬된 플레이리스트
     * 
     * useMemo를 사용하여 playlist, searchTerm, sortType이 변경될 때만
     * 재계산하여 성능 최적화
     */
    const filteredAndSortedPlaylist = useMemo(() => {
        // 원본 배열 복사 (불변성 유지)
        let result = [...playlist];

        // ===== 검색 필터링 =====
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(track =>
                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                (track.album && track.album.toLowerCase().includes(query))
            );
        }

        // ===== 정렬 =====
        result.sort((a, b) => {
            switch (sortType) {
                case "TITLE_ASC":
                    // 제목 가나다순
                    return a.title.localeCompare(b.title);
                case "TITLE_DESC":
                    // 제목 역순
                    return b.title.localeCompare(a.title);
                case "ARTIST_ASC":
                    // 가수 가나다순
                    return a.artist.localeCompare(b.artist);
                case "ARTIST_DESC":
                    // 가수 역순
                    return b.artist.localeCompare(a.artist);
                case "ALBUM_ASC":
                    // 앨범 가나다순
                    return (a.album || "").localeCompare(b.album || "");
                case "POPULARITY_DESC":
                    // 인기도 높은순
                    return (b.popularity || 0) - (a.popularity || 0);
                case "DATE_NEW":
                    // 발매일 최신순
                    return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
                case "DATE_OLD":
                    // 발매일 오래된순
                    return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
                case "ADDED":
                default:
                    // 추가된 순서 유지 (정렬하지 않음)
                    return 0; // Maintain original added order
            }
        });

        return result;
    }, [playlist, searchTerm, sortType]);  // 의존성 배열

    // ============================================================
    // =================== 비로그인 상태 처리 ======================
    // ============================================================

    /**
     * 비로그인 시 안내 메시지 표시
     * 
     * user가 null이면 플레이리스트를 볼 수 없으므로
     * 로그인 안내 메시지만 표시
     */
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

    // ============================================================
    // ===================== 이벤트 핸들러 =========================
    // ============================================================

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

    /**
     * 선택된 곡들 일괄 삭제
     * 
     * 확인 대화상자 표시 후 삭제 진행
     */
    const handleBulkDelete = () => {
        if (window.confirm(`${selectedIds.length}개의 곡을 삭제하시겠습니까?`)) {
            onRemoveMultiple(selectedIds);
            setSelectedIds([]);  // 선택 초기화
        }
    };

    /**
     * 전체 선택/해제 토글
     */
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredAndSortedPlaylist.length) {
            // 모두 선택되어 있으면 전체 해제
            setSelectedIds([]);
        } else {
            // 하나라도 선택되어 있지 않으면 전체 선택
            setSelectedIds(filteredAndSortedPlaylist.map(track => track.id));
        }
    };

    // ============================================================
    // ========================= 렌더링 ============================
    // ============================================================

    return (
        <section className="song-list-section" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* ========== 섹션 헤더 (제목 + 버튼) ========== */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="main-section-title" style={{ margin: 0 }}>My Playlist</h2>

                {/* 플레이리스트에 곡이 있을 때만 버튼 표시 */}
                {playlist.length > 0 && (
                    <div className="bulk-actions" style={{ marginBottom: 0 }}>
                        {/* 전체 선택/해제 버튼 */}
                        <button
                            className="main-nav-item"
                            onClick={toggleSelectAll}
                            style={{ marginRight: '15px', color: '#1DB954', cursor: 'pointer', background: 'transparent', border: 'none' }}
                        >
                            {selectedIds.length === filteredAndSortedPlaylist.length ? '전체 해제' : '전체 선택'}
                        </button>

                        {/* 선택 삭제 버튼 */}
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

            {/* ========== 검색 및 정렬 바 ========== */}
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                sortType={sortType}
                onSortChange={(e) => setSortType(e.target.value)}
            />

            {/* ========== 곡 리스트 컨테이너 ========== */}
            <div className="song-list-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '10px 0', marginTop: '20px' }}>
                {filteredAndSortedPlaylist.length === 0 ? (
                    /* ===== 플레이리스트가 비어있거나 검색 결과 없음 ===== */
                    <div className="no-result" style={{ padding: '40px' }}>
                        {searchTerm
                            ? '검색 결과가 없습니다.'
                            : "담긴 곡이 없습니다. '노래 목록'에서 곡을 추가해보세요!"
                        }
                    </div>
                ) : (
                    /* ===== 플레이리스트 곡 목록 ===== */
                    <ul className="main-chart-list">
                        {filteredAndSortedPlaylist.map((track, index) => (
                            <TrackRow
                                key={track.id}                              // React 리스트 key
                                track={track}                               // 트랙 데이터
                                rank={index + 1}                            // 순서 번호
                                selectable={true}                           // 체크박스 표시
                                selected={selectedIds.includes(track.id)}   // 선택 상태
                                onSelect={toggleSelection}                  // 체크박스 변경 핸들러
                                memo={memos ? memos[track.id] : ''}         // 해당 곡의 메모 (있으면)
                                onRemove={() => onRemove(track.id)}         // 개별 삭제 버튼 핸들러
                                onClick={() => onTrackClick(track)}         // 행 클릭 핸들러 (모달)
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default MyPlaylistPage;
