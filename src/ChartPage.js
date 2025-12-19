import React, { useEffect, useState } from 'react';
import { getMultiCharts } from './spotify';
import Hero from './component/Hero';
import TrackRow from './component/TrackRow';
import './MainPage.css';

function ChartPage({ onTrackClick }) {
    const [charts, setCharts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getMultiCharts();
            setCharts(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="main-page-loading" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Loading Charts...
            </div>
        );
    }

    const firstChart = charts.length > 0 ? charts[0] : null;
    const cover1 = firstChart?.tracks[0]?.cover; // 1위 곡 커버
    const cover2 = firstChart?.tracks[1]?.cover; // 2위 곡 커버

    return (
        <div className="chart-page">
            {/* 첫 번째 차트의 타이틀을 Hero에 전달 (옵션) */}
            {charts.length > 0 && (
                <Hero 
                    onSearchClick={() => {}} 
                    title="OSS MUSIC CHARTS"
                    cover1={cover1}
                    cover2={cover2}
                />
            )}

            {/* ▼ 2행 3열 그리드 컨테이너 ▼ */}
            <div className="charts-grid">
                {charts.map((chart, chartIndex) => (
                    <section key={chartIndex} className="chart-card">
                        {/* 섹션 제목 */}
                        <h2 className="chart-title">
                            {chart.title}
                        </h2>

                        {/* 트랙 리스트 (스크롤 가능하게 처리할 수도 있음) */}
                        <ul className="mini-track-list">
                            {chart.tracks.map((track, i) => (
                                <TrackRow
                                    key={track.id}
                                    track={track}
                                    rank={i + 1}
                                    showAlbumInfo={false} // 공간이 좁으니 앨범 정보는 숨김
                                    onClick={() => onTrackClick(track)}
                                />
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default ChartPage;