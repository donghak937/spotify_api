import React from 'react';
import '../MainPage.css';

const SearchBar = ({ searchTerm, onSearchChange, sortType, onSortChange }) => {
    return (
        <div className="song-list-controls">
            <input
                type="text"
                className="search-bar"
                placeholder="제목, 가수, 앨범 검색..."
                value={searchTerm}
                onChange={onSearchChange}
            />

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
