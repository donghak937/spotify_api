import React, { useEffect, useState } from "react";
import './MainPage.css';
import { getRandomKpopTracks, getRandomRapSongTracks } from './spotify';
import SearchBar from './component/SearchBar';
import TrackRow from './component/TrackRow';

function SongList({ onAdd, onTrackClick }) {
    const [tracks, setTracks] = useState([]);
    const [rapTracks, setRapTracks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어
    const [sortType, setSortType] = useState("RANK"); // 정렬 기준

    useEffect(() => {
        const fetchData = async () => {
            const kpopTracks = await getRandomKpopTracks();
            if (kpopTracks && kpopTracks.length > 0) {
                setTracks(kpopTracks);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const rapTracks = await getRandomRapSongTracks();
            if (rapTracks && rapTracks.length > 0) {
                setRapTracks(rapTracks);
            }
        };
        fetchData();
    }, []);

    // 검색
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 정렬 변경
    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    // 통합 트랙 리스트 (K-pop + Rap)
    const allTracks = [...tracks, ...rapTracks];

    // 필터링
    const filteredTracks = allTracks.filter((track) => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            track.title.toLowerCase().includes(lowerTerm) ||
            track.artist.toLowerCase().includes(lowerTerm) ||
            (track.album && track.album.toLowerCase().includes(lowerTerm))
        );
    });

    // 정렬 로직 (7개 이상)
    const sortedTracks = filteredTracks.sort((a, b) => {
        switch (sortType) {
            case "TITLE_ASC": // 제목 가나다순
                return a.title.localeCompare(b.title);
            case "TITLE_DESC": // 제목 가나다역순
                return b.title.localeCompare(a.title);
            case "ARTIST_ASC": // 아티스트 가나다순
                return a.artist.localeCompare(b.artist);
            case "ARTIST_DESC": // 아티스트 가나다역순
                return b.artist.localeCompare(a.artist);
            case "ALBUM_ASC": // 앨범 가나다순
                return (a.album || "").localeCompare(b.album || "");
            case "POPULARITY_DESC": // 인기도 높은순
                return (b.popularity || 0) - (a.popularity || 0);
            case "DATE_NEW": // 발매일 최신순
                return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
            case "DATE_OLD": // 발매일 오래된순
                return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
            case "RANK": // 랭킹순 (기본, 여기서는 그냥 id나 rank 순으로 유지 or 섞인 그대로)
            default:
                // 합쳐진 리스트라 절대적 랭크는 애매하지만, 일단 기본 순서 유지
                return 0;
        }
    });

    return (
        <section className="song-list-section">
            <h2 className="main-section-title">전체 노래 목록</h2>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                sortType={sortType}
                onSortChange={handleSortChange}
            />

            <ul className="main-chart-list song-list-combined">
                {sortedTracks.map((track, i) => (
                    <TrackRow
                        key={`${track.id}-${i}`}
                        track={track}
                        rank={i + 1}
                        showAlbumInfo={true}
                        onAdd={() => onAdd(track)}
                        onClick={() => onTrackClick(track)}
                    />
                ))}
            </ul>
            {sortedTracks.length === 0 && (
                <div className="no-result">검색 결과가 없습니다.</div>
            )}
        </section>
    );
}


export default SongList;
