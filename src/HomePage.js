import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMultiCharts } from './spotify';
import Hero from './component/Hero';
import TrackRow from './component/TrackRow';
import './MainPage.css';

function HomePage({ onTrackClick }) {
    const [topChart, setTopChart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopData = async () => {
            // 차트 데이터를 가져와서 첫 번째 것만 메인에 표시
            const data = await getMultiCharts();
            if (data && data.length > 0) {
                setTopChart(data[0]); 
            }
        };
        fetchTopData();
    }, []);

    return (
        <div className="home-page">
            {/* 1. 상단 Hero 섹션 */}
            <Hero 
                onSearchClick={() => navigate('/songs')}
                title={topChart ? topChart.title : "K-pop Chart"}
            />

            {/* 2. 대표 차트 미리보기 (10곡) */}
            <div style={{ padding: '0 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                {topChart ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px', marginBottom: '20px' }}>
                            <h2 className="main-section-title" style={{ marginBottom: 0 }}>
                                🔥 {topChart.title}
                            </h2>
                            <button 
                                onClick={() => navigate('/charts')}
                                style={{
                                    background: 'transparent',
                                    color: '#b3b3b3',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                }}
                            >
                                모든 차트 보기 &gt;
                            </button>
                        </div>

                        <ul className="main-chart-list">
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

                        {/* 하단 큰 버튼 */}
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button 
                                onClick={() => navigate('/charts')}
                                className="login-btn" // 기존 초록색 버튼 스타일 재사용
                                style={{ padding: '15px 40px', fontSize: '16px' }}
                            >
                                6가지 테마 차트 전체 구경하기
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="main-page-loading" style={{ padding: '50px', textAlign: 'center' }}>
                        Loading Best Songs...
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;