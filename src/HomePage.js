import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMultiCharts } from './spotify';
import Hero from './component/Hero';
import TrackRow from './component/TrackRow';
import './MainPage.css';

function HomePage({ onTrackClick }) {
    const [topChart, setTopChart] = useState(null);
    const [hotArtists, setHotArtists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopData = async () => {
            const data = await getMultiCharts();
            if (data && data.length > 0) {
                const chart = data[0];
                setTopChart(chart);

                // 🔥 데이터에서 아티스트 추출 로직
                // 중복 아티스트 제거하고 6명만 뽑기
                const uniqueArtists = [];
                const seen = new Set();

                chart.tracks.forEach(track => {
                    if (!seen.has(track.artist)) {
                        seen.add(track.artist);
                        uniqueArtists.push({
                            name: track.artist,
                            image: track.cover // 아티스트 사진 대신 앨범 커버를 사용 (API 제한 때문)
                        });
                    }
                });

                // 최대 9명까지만 설정
                setHotArtists(uniqueArtists.slice(0, 9));
            }
        };
        fetchTopData();
    }, []);

    // topChart가 있으면 1위, 2위 커버 추출 (Hero용)
    const cover1 = topChart?.tracks[0]?.cover;
    const cover2 = topChart?.tracks[1]?.cover;

    return (
        <div className="home-page">
            {/* 1. 상단 Hero 섹션 */}
            <Hero
                onSearchClick={() => navigate('/songs')}
                title="WELCOME TO OSS MUSIC!"
                cover1={cover1}
                cover2={cover2}
            />

            {/* 2. 메인 컨텐츠 영역 (좌우 분할) */}
            <div style={{ padding: '0 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>

                {topChart ? (
                    <div className="home-layout">

                        {/* [왼쪽] 차트 리스트 */}
                        <section className="home-chart-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="main-section-title" style={{ marginBottom: 0 }}>
                                    🔥 인기 급상승
                                </h2>
                                <button
                                    onClick={() => navigate('/charts')}
                                    style={{ background: 'none', color: '#b3b3b3', fontSize: '13px', fontWeight: 'bold' }}
                                >
                                    더보기
                                </button>
                            </div>

                            <ul className="mini-track-list">
                                {topChart.tracks.map((track, i) => (
                                    <TrackRow
                                        key={track.id}
                                        track={track}
                                        rank={i + 1}
                                        showAlbumInfo={true}
                                        onClick={() => onTrackClick(track)}
                                    />
                                ))}
                            </ul>
                        </section>

                        {/* [오른쪽] 사이드바 (아티스트 & 태그) */}
                        <aside className="home-side-section">

                            {/* 추천 아티스트 (클릭하면 해당 아티스트로 검색) */}
                            <div>
                                <h3 className="main-section-title" style={{ fontSize: '20px' }}>🎤 Trend Artists</h3>
                                <div className="artist-grid">
                                    {hotArtists.map((artist, idx) => (
                                        <div
                                            key={idx}
                                            className="artist-item"
                                            onClick={() => navigate(`/songs?search=${encodeURIComponent(artist.name)}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={artist.image} alt={artist.name} className="artist-img" />
                                            <span className="artist-name">{artist.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 추천 태그 (클릭하면 해당 키워드로 검색) */}
                            <div>
                                <h3 className="main-section-title" style={{ fontSize: '20px' }}>🏷️ Hot Keywords</h3>
                                <div className="keyword-tags">
                                    {['뉴진스', '드라이브', '운동할때', 'K-POP', '노동요', '새벽감성'].map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="keyword-tag"
                                            onClick={() => navigate(`/songs?search=${encodeURIComponent(keyword)}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </aside>

                    </div>
                ) : (
                    <div className="main-page-loading" style={{ padding: '50px', textAlign: 'center' }}>
                        Loading...
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;