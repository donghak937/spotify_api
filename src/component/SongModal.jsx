/**
 * @file SongModal.jsx
 * @description 곡 상세 정보를 표시하는 모달 컴포넌트
 * 
 * 모달에서 제공하는 기능:
 * - 앨범 커버 이미지 크게 표시
 * - 곡 정보 (제목, 아티스트, 앨범, 발매일, 재생시간, 인기도)
 * - 플레이리스트 추가/삭제 토글 버튼
 * - 개인 메모 보기/작성/수정 기능
 * 
 * 모달은 오버레이와 함께 화면 중앙에 표시됩니다.
 * 오버레이 클릭 또는 X 버튼 클릭으로 닫을 수 있습니다.
 */

import React from 'react';

// 스타일
import '../MainPage.css';

/**
 * SongModal 컴포넌트
 * 
 * 곡의 상세 정보를 보여주고 메모를 관리하는 모달
 * 
 * @component
 * @param {Object} props
 * @param {Track} props.track - 표시할 트랙 데이터
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Object|null} props.user - 현재 로그인한 사용자 (메모 수정 권한 확인)
 * @param {string} [props.memo=""] - 현재 저장된 메모 내용
 * @param {Function} [props.onSaveMemo] - 메모 저장 핸들러 (trackId, text) => void
 * @param {boolean} props.isSaved - 플레이리스트에 저장되어 있는지 여부
 * @param {Function} props.onTogglePlaylist - 플레이리스트 추가/삭제 토글 핸들러
 * @returns {JSX.Element|null} 모달 컴포넌트 (track이 없으면 null)
 * 
 * @example
 * {selectedTrack && (
 *   <SongModal
 *     track={selectedTrack}
 *     onClose={() => setSelectedTrack(null)}
 *     user={user}
 *     memo={memos[selectedTrack.id] || ""}
 *     onSaveMemo={handleSaveMemo}
 *     isSaved={myPlaylist.some(t => t.id === selectedTrack.id)}
 *     onTogglePlaylist={handleToggle}
 *   />
 * )}
 */
const SongModal = ({ track, onClose, user, memo = "", onSaveMemo, isSaved, onTogglePlaylist }) => {
    // ============================================================
    // ======================== 상태 정의 ==========================
    // ============================================================

    /**
     * 현재 메모 내용 (편집 중인 값)
     * 초기값은 props로 받은 memo
     */
    const [currentMemo, setCurrentMemo] = React.useState(memo);

    /**
     * 편집 모드 여부
     * false: 읽기 모드 (메모 내용만 표시)
     * true: 편집 모드 (textarea 표시)
     */
    const [isEditing, setIsEditing] = React.useState(false);

    /**
     * props의 memo가 변경되면 currentMemo도 업데이트
     * (다른 곡을 클릭했을 때 해당 곡의 메모로 변경)
     */
    React.useEffect(() => {
        setCurrentMemo(memo);
    }, [memo]);

    // ============================================================
    // ====================== 조건부 렌더링 ========================
    // ============================================================

    /**
     * track이 없으면 아무것도 렌더링하지 않음
     * 모달이 닫힌 상태에서 불필요한 렌더링 방지
     */
    if (!track) return null;

    // ============================================================
    // =================== 유틸리티 함수 ===========================
    // ============================================================

    /**
     * 밀리초를 분:초 형식으로 변환
     * 
     * @param {number} ms - 밀리초
     * @returns {string} - "0:00" 형식의 문자열
     * 
     * @example
     * formatTime(210000) // "3:30"
     */
    const formatTime = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        // 초가 10 미만이면 앞에 0 추가 (예: 3:05)
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    // ============================================================
    // =================== 메모 관련 핸들러 ========================
    // ============================================================

    /**
     * 메모 저장 핸들러
     * 
     * onSaveMemo 콜백을 호출하여 부모 컴포넌트에 저장 요청
     * 저장 후 편집 모드 종료
     */
    const handleSave = () => {
        if (onSaveMemo) {
            onSaveMemo(track.id, currentMemo);
        }
        setIsEditing(false);
    };

    /**
     * 메모 편집 취소 핸들러
     * 
     * 편집 중인 내용을 원래 메모로 되돌리고 편집 모드 종료
     */
    const handleCancel = () => {
        setCurrentMemo(memo);  // 원래 메모로 되돌리기
        setIsEditing(false);
    }

    // ============================================================
    // ========================= 렌더링 ============================
    // ============================================================

    return (
        /**
         * 오버레이: 모달 뒤의 어두운 배경
         * 클릭하면 모달 닫기 (onClose 호출)
         */
        <div className="modal-overlay" onClick={onClose}>
            {/* 
              모달 컨텐츠 영역
              e.stopPropagation(): 모달 내부 클릭이 오버레이 클릭으로 전파되지 않도록 막음
            */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* 닫기 버튼 (우측 상단) */}
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {/* ========== 왼쪽: 앨범 커버 이미지 ========== */}
                <div className="modal-img-wrap">
                    <img src={track.cover} alt={track.title} className="modal-img" />
                </div>

                {/* ========== 오른쪽: 곡 정보 및 메모 ========== */}
                <div className="modal-info">
                    {/* 곡 제목 */}
                    <h2 className="modal-title">{track.title}</h2>

                    {/* 아티스트 */}
                    <p className="modal-artist">{track.artist}</p>

                    {/* 상세 정보 (앨범, 발매일, 재생시간, 인기도) */}
                    <div className="modal-details">
                        {track.album && <p className="modal-detail-item"><strong>Album:</strong> {track.album}</p>}
                        {track.releaseDate && <p className="modal-detail-item"><strong>Release:</strong> {track.releaseDate}</p>}
                        {track.duration && <p className="modal-detail-item"><strong>Duration:</strong> {formatTime(track.duration)}</p>}
                        {track.popularity !== undefined && <p className="modal-detail-item"><strong>Popularity:</strong> {track.popularity}%</p>}
                    </div>

                    {/* 플레이리스트 추가/삭제 버튼 */}
                    <div className="modal-btn-group">
                        <button
                            className={`btn-icon ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={onTogglePlaylist}
                        >
                            {/* isSaved 상태에 따라 버튼 텍스트 변경 */}
                            {isSaved ? '💔 Remove' : '❤️ Add to Playlist'}
                        </button>
                    </div>

                    {/* ========== 메모 섹션 ========== */}
                    <div className="modal-memo-section">
                        {/* 메모 제목 + Edit 버튼 */}
                        <div className="modal-memo-title-wrap">
                            <h3 className="modal-memo-title">📝 My Memo</h3>
                            {/* 로그인 상태이고 편집 모드가 아닐 때만 Edit 버튼 표시 */}
                            {user && !isEditing && (
                                <button className="modal-memo-btn" onClick={() => setIsEditing(true)}>Edit</button>
                            )}
                        </div>

                        {user ? (
                            /* ===== 로그인 상태 ===== */
                            isEditing ? (
                                /* ----- 편집 모드 ----- */
                                <>
                                    {/* 메모 입력 textarea */}
                                    <textarea
                                        className="modal-memo-input"
                                        value={currentMemo}
                                        onChange={(e) => setCurrentMemo(e.target.value)}
                                        placeholder="Write your thoughts about this song..."
                                        autoFocus  // 편집 모드 진입 시 자동 포커스
                                    />
                                    {/* 취소/저장 버튼 */}
                                    <div className="memo-actions">
                                        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                                        <button className="btn-save" onClick={handleSave}>Save</button>
                                    </div>
                                </>
                            ) : (
                                /* ----- 읽기 모드 ----- */
                                <div className="modal-memo-display">
                                    {/* 메모가 있으면 내용 표시, 없으면 안내 메시지 */}
                                    {currentMemo ? currentMemo : <span style={{ color: '#666' }}>No memo yet. Click edit to add one.</span>}
                                </div>
                            )
                        ) : (
                            /* ===== 비로그인 상태: 로그인 유도 ===== */
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
