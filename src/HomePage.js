/**
 * @file HomePage.js
 * @description 앱의 메인 홈페이지 컴포넌트
 * 
 * 홈페이지에는 다음 요소들이 표시됩니다:
 * 1. Hero 섹션 (대형 배너)
 * 2. 인기 급상승 차트 (Top 10)
 * 3. 트렌드 아티스트 (클릭 시 검색)
 * 4. 핫 키워드 태그 (클릭 시 검색)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Spotify API 함수
import { getMultiCharts } from './spotify';

// 컴포넌트
import Hero from './component/Hero';        // 상단 히어로 배너
import TrackRow from './component/TrackRow';  // 트랙 행 아이템

// 스타일
import './MainPage.css';

/**
 * HomePage 컴포넌트
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onTrackClick - 트랙 클릭 시 호출되는 핸들러 (모달 열기)
 * @returns {JSX.Element} 홈페이지 컴포넌트
 */
function HomePage({ onTrackClick }) {
    // ============================================================
    // ======================== 상태 정의 ==========================
    // ============================================================

    /**
     * 상위 차트 데이터
     * @type {Object|null}
     * - null: 로딩 중
     * - Object: { title: string, tracks: Track[] }
     */
    const [topChart, setTopChart] = useState(null);

    /**
     * 트렌드 아티스트 목록
     * @type {Array<{name: string, image: string}>}
     * - 차트 데이터에서 추출한 아티스트들
     * - 최대 9명까지 표시
     */
    const [hotArtists, setHotArtists] = useState([]);

    // 페이지 이동 함수
    const navigate = useNavigate();

    // ============================================================
    // ===================== 데이터 로딩 ===========================
    // ============================================================

    /**
     * 컴포넌트 마운트 시 차트 데이터 로드
     * 
     * 1. getMultiCharts()로 여러 장르의 차트 데이터 가져오기
     * 2. 첫 번째 차트를 메인 차트로 사용
     * 3. 차트의 트랙들에서 아티스트 추출 (중복 제거, 최대 9명)
     */
    useEffect(() => {
        const fetchTopData = async () => {
            // Spotify API에서 차트 데이터 가져오기
            const data = await getMultiCharts();

            if (data && data.length > 0) {
                // 첫 번째 차트를 메인 차트로 설정
                const chart = data[0];
                setTopChart(chart);

                /**
                 * 🔥 아티스트 추출 로직
                 * 
                 * 차트의 트랙들에서 고유한 아티스트만 추출합니다.
                 * Set을 사용하여 중복을 제거합니다.
                 */
                const uniqueArtists = [];
                const seen = new Set();  // 이미 추가된 아티스트 이름 저장

                chart.tracks.forEach(track => {
                    // 아직 추가되지 않은 아티스트인 경우에만 추가
                    if (!seen.has(track.artist)) {
                        seen.add(track.artist);
                        uniqueArtists.push({
                            name: track.artist,
                            // 아티스트 전용 이미지 API가 없으므로 앨범 커버를 대신 사용
                            image: track.cover // 아티스트 사진 대신 앨범 커버를 사용 (API 제한 때문)
                        });
                    }
                });

                // 최대 9명까지만 표시 (3x3 그리드)
                setHotArtists(uniqueArtists.slice(0, 9));
            }
        };
        fetchTopData();
    }, []);  // 빈 배열 = 컴포넌트 마운트 시 1회만 실행

    // ============================================================
    // ===================== 렌더링 준비 ===========================
    // ============================================================

    /**
     * Hero 컴포넌트에 전달할 앨범 커버 이미지
     * 
     * 차트의 1위, 2위 곡 커버를 사용합니다.
     * Optional Chaining(?.)으로 데이터가 없을 때 undefined 반환
     */
    const cover1 = topChart?.tracks[0]?.cover;  // 1위 곡 커버
    const cover2 = topChart?.tracks[1]?.cover;  // 2위 곡 커버

    // ============================================================
    // ======================== 렌더링 =============================
    // ============================================================

    return (
        <div className="home-page">
            {/* ========== 1. 상단 Hero 섹션 ========== */}
            {/* 
              Hero: 페이지 상단의 큰 배너 영역
              - 환영 메시지와 검색 버튼 표시
              - 1위, 2위 앨범 커버 이미지 표시
            */}
            <Hero
                onSearchClick={() => navigate('/songs')}  // 검색 버튼 클릭 시 노래 목록 페이지로 이동
                title="WELCOME TO OSS MUSIC!"             // 배너 제목
                cover1={cover1}                           // 1위 앨범 커버
                cover2={cover2}                           // 2위 앨범 커버
            />

            {/* ========== 2. 메인 컨텐츠 영역 (좌우 분할) ========== */}
            <div style={{ padding: '0 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* 데이터 로딩 완료 시 표시, 로딩 중이면 로딩 메시지 */}
                {topChart ? (
                    <div className="home-layout">

                        {/* ===== [왼쪽] 차트 리스트 ===== */}
                        <section className="home-chart-section">
                            {/* 섹션 헤더: 제목 + 더보기 버튼 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="main-section-title" style={{ marginBottom: 0 }}>
                                    🔥 인기 급상승
                                </h2>
                                {/* 더보기 버튼 - 차트 전체 페이지로 이동 */}
                                <button
                                    onClick={() => navigate('/charts')}
                                    style={{ background: 'none', color: '#b3b3b3', fontSize: '13px', fontWeight: 'bold' }}
                                >
                                    더보기
                                </button>
                            </div>

                            {/* 트랙 리스트 */}
                            <ul className="mini-track-list">
                                {topChart.tracks.map((track, i) => (
                                    <TrackRow
                                        key={track.id}            // React의 list key
                                        track={track}             // 트랙 데이터
                                        rank={i + 1}              // 순위 (1부터 시작)
                                        showAlbumInfo={true}      // 앨범 정보 표시
                                        onClick={() => onTrackClick(track)}  // 클릭 시 모달 열기
                                    />
                                ))}
                            </ul>
                        </section>

                        {/* ===== [오른쪽] 사이드바 (아티스트 & 태그) ===== */}
                        <aside className="home-side-section">

                            {/* ----- 추천 아티스트 섹션 ----- */}
                            {/* 클릭 시 해당 아티스트 이름으로 검색 페이지 이동 */}
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
                                            {/* 아티스트 이미지 (앨범 커버 대체) */}
                                            <img src={artist.image} alt={artist.name} className="artist-img" />
                                            {/* 아티스트 이름 */}
                                            <span className="artist-name">{artist.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ----- 추천 키워드 태그 섹션 ----- */}
                            {/* 클릭 시 해당 키워드로 검색 페이지 이동 */}
                            <div>
                                <h3 className="main-section-title" style={{ fontSize: '20px' }}>🏷️ Hot Keywords</h3>
                                <div className="keyword-tags">
                                    {/* 사전 정의된 인기 키워드 목록 */}
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
                    /* ===== 로딩 상태 표시 ===== */
                    <div className="main-page-loading" style={{ padding: '50px', textAlign: 'center' }}>
                        Loading...
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;