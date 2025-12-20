/**
 * @file TrackRow.jsx
 * @description 트랙 정보를 한 줄로 표시하는 리스트 아이템 컴포넌트
 * 
 * 이 컴포넌트는 다음 페이지들에서 사용됩니다:
 * - HomePage (인기 급상승 차트)
 * - ChartPage (장르별 차트)
 * - SongList (노래 목록)
 * - MyPlaylistPage (내 플레이리스트)
 * 
 * 표시되는 정보:
 * - 체크박스 (선택 기능, 옵션)
 * - 순위 번호
 * - 앨범 커버 이미지
 * - 곡 제목 및 아티스트
 * - 앨범 정보 (옵션)
 * - 메모 (옵션)
 * - 액션 버튼 (추가/삭제, 옵션)
 */

import React from 'react';

// 스타일
import '../MainPage.css';

/**
 * TrackRow 컴포넌트
 * 
 * 트랙 정보를 수평으로 배치하는 리스트 아이템
 * 다양한 props로 표시/동작을 커스터마이징할 수 있습니다.
 * 
 * @component
 * @param {Object} props
 * @param {Track} props.track - 트랙 데이터 객체
 * @param {number} props.rank - 표시할 순위 번호
 * @param {boolean} [props.showAlbumInfo=false] - 앨범/발매일 정보 표시 여부
 * @param {Function} [props.onAdd] - 추가 버튼 클릭 핸들러 (있으면 + 버튼 표시)
 * @param {Function} [props.onRemove] - 삭제 버튼 클릭 핸들러 (있으면 - 버튼 표시)
 * @param {Function} [props.onClick] - 행 전체 클릭 핸들러 (모달 열기 등)
 * @param {boolean} [props.selectable=false] - 체크박스 표시 여부
 * @param {boolean} [props.selected=false] - 체크박스 선택 상태
 * @param {Function} [props.onSelect] - 체크박스 변경 핸들러 (id) => void
 * @param {string} [props.memo] - 표시할 메모 텍스트
 * @returns {JSX.Element} 트랙 행 컴포넌트
 * 
 * @example
 * // 기본 사용 (차트 표시용)
 * <TrackRow track={track} rank={1} />
 * 
 * // 전체 기능 사용 (SongList)
 * <TrackRow
 *   track={track}
 *   rank={1}
 *   showAlbumInfo={true}
 *   selectable={true}
 *   selected={isSelected}
 *   onSelect={toggleSelection}
 *   onAdd={() => addToPlaylist(track)}
 *   onClick={() => openModal(track)}
 * />
 */
const TrackRow = ({ track, rank, showAlbumInfo = false, onAdd, onRemove, onClick, selectable = false, selected = false, onSelect, memo }) => {
    return (
        <li className="main-track-row" onClick={onClick} style={{ cursor: 'pointer' }}>
            {/* ========== 체크박스 (선택 기능) ========== */}
            {/* selectable이 true일 때만 표시 */}
            {selectable && (
                <div className="main-track-checkbox" onClick={(e) => e.stopPropagation()}>
                    {/* 
                      e.stopPropagation(): 
                      체크박스 클릭이 행 전체 클릭(onClick)으로 전파되지 않도록 막음
                    */}
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(track.id)}
                    />
                </div>
            )}

            {/* ========== 순위 번호 ========== */}
            <div className="main-track-rank">
                {rank}
            </div>

            {/* ========== 앨범 커버 이미지 ========== */}
            <div className="main-track-cover-wrap">
                <img
                    className="main-track-cover"
                    src={track.cover}
                    alt={track.title}
                />
                {/* 호버 시 나타나는 재생 버튼 (시각적 요소) */}
                <button className="main-track-play">▶</button>
            </div>

            {/* ========== 곡 정보 (제목, 아티스트, 앨범) ========== */}
            <div className="main-track-meta">
                <div className="main-track-title">{track.title}</div>
                <div className="main-track-artist">{track.artist}</div>

                {/* 앨범 정보: showAlbumInfo가 true일 때만 표시 */}
                {showAlbumInfo && (
                    <div className="main-track-album-info">
                        {track.album && <span className="track-album">💿 {track.album} </span>}
                        {track.releaseDate && <span className="track-date">📅 {track.releaseDate}</span>}
                    </div>
                )}
            </div>

            {/* ========== 메모 표시 ========== */}
            {/* memo prop이 있을 때만 표시 (MyPlaylistPage에서 사용) */}
            {memo && (
                <div className="main-track-memo">
                    <span className="memo-label">Memo:</span>
                    <span className="memo-text">{memo}</span>
                </div>
            )}

            {/* ========== 액션 버튼들 ========== */}
            <div className="main-track-actions">
                {/* 추가 버튼: onAdd가 있을 때만 표시 */}
                {onAdd && (
                    <button
                        className="add-btn"
                        onClick={(e) => {
                            e.stopPropagation();  // 행 클릭 이벤트 전파 막기
                            onAdd();
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        +
                    </button>
                )}

                {/* 삭제 버튼: onRemove가 있을 때만 표시 (분홍색 테두리) */}
                {onRemove && (
                    <button
                        className="remove-btn"
                        onClick={(e) => {
                            e.stopPropagation();  // 행 클릭 이벤트 전파 막기
                            onRemove();
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid #e91e63',
                            color: '#e91e63',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        -
                    </button>
                )}
            </div>
        </li>
    );
};

export default TrackRow;
