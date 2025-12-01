import React, { useEffect, useState } from "react";
import './MainPage.css';
import { getRandomKpopTracks } from './spotify';
import { getRandomRapSongTracks } from './spotify';

function MainPage() {
  const [tracks, setTracks] = useState([]);
  const [rapTracks, setRapTracks] = useState([]);

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

  return (
    <div className="main-page">
      {/* 최상단 네비바 */}
      <header className="main-header">
        <div className="main-header-left">
          <div className="main-logo">OSS MUSIC</div>

          <nav className="main-nav">
            <button className="main-nav-item">앱 제작자</button>
            <button className="main-nav-item">노래 목록</button>
            <button className="main-nav-item">차트</button>
            <button className="main-nav-item">내 플레이 리스트</button>
          </nav>
        </div>

        <div className="main-header-right">
          <button className="main-apple-btn">로그인</button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-hero-section">
        {/* K-pop Chart 헤더 영역 */}
        <section className="main-hero">
          <div className="main-hero-left">
            <div className="main-hero-title-wrap">
              <button className="main-play-circle">▶</button>
              <div>
                <h1 className="main-hero-title">K-pop Chart</h1>
                <p className="main-hero-desc">
                  이번 달의 가장 핫한 트랙들을 소개해드려요!
                </p>
              </div>
            </div>

            <div className="main-tabs">
              <button className="main-tab main-tab--active">검색하기</button>
            </div>
          </div>

          {/* 오른쪽 상단에 카드 슬라이드 같은 이미지 영역은 대충 박스 하나로 */}
          <div className="main-hero-artwork">
            <div className="main-art-card">Album</div>
            <div className="main-art-card main-art-card--tilt">Cover</div>
          </div>
        </section>

        {/* K-pop Chart + Rap Chart 2단 레이아웃 */}
        <section className="main-body">
          {/* K-pop Chart */}
          <div className="main-chart">
            <h2 className="main-section-title">K-pop Chart</h2>

            <div className="main-video-card">
              <div className="main-video-thumb">K-pop</div>
              <div className="main-video-info">
                <div className="main-video-title">무작위 K-pop 트랙</div>
                <p className="main-video-desc">
                  무작위 K-pop 트랙을 소개해드려요!
                </p>
              </div>
            </div>

            <ul className="main-chart-list">
              {tracks.map((track) => (
                <li key={track.id} className="main-track-row">
                  <div className="main-track-rank">{track.rank}</div>

                  <div className="main-track-cover-wrap">
                    <img
                      className="main-track-cover"
                      src={track.cover}
                      alt={track.title}
                    />
                    <button className="main-track-play">▶</button>
                  </div>

                  <div className="main-track-meta">
                    <div className="main-track-title">{track.title}</div>
                    <div className="main-track-artist">{track.artist}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* 무작위 랩 음악 */}
          <div className="main-chart">
            <h2 className="main-section-title">Rap Chart</h2>

            <div className="main-video-card">
              <div className="main-video-thumb">Rap</div>
              <div className="main-video-info">
                <div className="main-video-title">무작위 Rap 트랙</div>
                <p className="main-video-desc">
                  무작위 Rap 트랙을 소개해드려요!
                </p>
              </div>
            </div>

            <ul className="main-chart-list">
              {rapTracks.map((track) => (
                <li key={track.id} className="main-track-row">
                  <div className="main-track-rank">{track.rank}</div>

                  <div className="main-track-cover-wrap">
                    <img
                      className="main-track-cover"
                      src={track.cover}
                      alt={track.title}
                    />
                    <button className="main-track-play">▶</button>
                  </div>

                  <div className="main-track-meta">
                    <div className="main-track-title">{track.title}</div>
                    <div className="main-track-artist">{track.artist}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </section>
      </main>
    </div>
  );
}

export default MainPage;
