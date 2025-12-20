/**
 * @file SearchBar.jsx
 * @description 검색 입력창과 정렬 옵션 셀렉트박스 컴포넌트
 * 
 * 이 컴포넌트는 SongList와 MyPlaylistPage에서 사용됩니다.
 * 검색어 입력과 정렬 기준 선택 기능을 제공합니다.
 */

import React from 'react';

// 스타일
import '../MainPage.css';

/**
 * SearchBar 컴포넌트
 * 
 * 검색 입력창과 정렬 옵션을 가로로 배치한 컨트롤 바
 * 
 * @component
 * @param {Object} props
 * @param {string} props.searchTerm - 현재 검색어 (입력 필드의 value)
 * @param {Function} props.onSearchChange - 검색어 변경 핸들러 (onChange 이벤트)
 * @param {string} props.sortType - 현재 정렬 타입 (셀렉트박스의 value)
 * @param {Function} props.onSortChange - 정렬 타입 변경 핸들러 (onChange 이벤트)
 * @returns {JSX.Element} 검색바 컴포넌트
 * 
 * @example
 * <SearchBar
 *   searchTerm={searchTerm}
 *   onSearchChange={(e) => setSearchTerm(e.target.value)}
 *   sortType={sortType}
 *   onSortChange={(e) => setSortType(e.target.value)}
 * />
 */
const SearchBar = ({ searchTerm, onSearchChange, sortType, onSortChange }) => {
    return (
        <div className="song-list-controls">
            {/* ========== 검색 입력 필드 ========== */}
            {/* 
              Controlled Component 패턴:
              - value는 부모 컴포넌트의 state와 연결
              - onChange로 입력 이벤트를 부모에게 전달
            */}
            <input
                type="text"
                className="search-bar"
                placeholder="제목, 가수, 앨범 검색..."
                value={searchTerm}
                onChange={onSearchChange}
            />

            {/* ========== 정렬 옵션 셀렉트박스 ========== */}
            {/* 
              정렬 옵션 목록:
              - RANK: 기본 (랭킹순, 원래 순서 유지)
              - TITLE_ASC/DESC: 제목 순
              - ARTIST_ASC/DESC: 가수 순
              - ALBUM_ASC: 앨범 순
              - POPULARITY_DESC: 인기도 순
              - DATE_NEW/OLD: 발매일 순
            */}
            <select className="sort-select" value={sortType} onChange={onSortChange}>
                <option value="RANK">기본 (랭킹순)</option>
                <option value="TITLE_ASC">제목 (가나다순)</option>
                <option value="TITLE_DESC">제목 (역순)</option>
                <option value="ARTIST_ASC">가수 (가나다순)</option>
                <option value="ARTIST_DESC">가수 (역순)</option>
                <option value="ALBUM_ASC">앨범 (가나다순)</option>
                <option value="POPULARITY_DESC">인기도 (높은순)</option>
                <option value="DATE_NEW">발매일 (최신순)</option>
                <option value="DATE_OLD">발매일 (오래된순)</option>
            </select>
        </div>
    );
};

export default SearchBar;
