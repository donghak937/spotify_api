/**
 * @file Hero.jsx
 * @description 페이지 상단의 히어로 배너 컴포넌트
 * 
 * 히어로 섹션에 포함된 요소:
 * - 제목 및 설명 텍스트
 * - 재생 버튼 (시각적 요소)
 * - 검색 버튼 (클릭 시 노래 목록 페이지로 이동)
 * - 앨범 커버 이미지 2개 (1위, 2위 곡)
 */

import React from 'react';

// 스타일
import '../MainPage.css';

/**
 * Hero 컴포넌트
 * 
 * 페이지 상단에 표시되는 대형 배너
 * HomePage와 ChartPage에서 사용됩니다.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onSearchClick - 검색 버튼 클릭 핸들러
 * @param {string} [props.title] - 히어로 섹션 제목 (기본값: "K-pop Chart")
 * @param {string} [props.cover1] - 1위 앨범 커버 이미지 URL
 * @param {string} [props.cover2] - 2위 앨범 커버 이미지 URL
 * @returns {JSX.Element} 히어로 배너 컴포넌트
 * 
 * @example
 * <Hero 
 *   onSearchClick={() => navigate('/songs')}
 *   title="WELCOME TO OSS MUSIC!"
 *   cover1={topTrack.cover}
 *   cover2={secondTrack.cover}
 * />
 */
const Hero = ({ onSearchClick, title, cover1, cover2 }) => {
    return (
        <section className="main-hero">
            {/* ========== 왼쪽 영역: 텍스트 및 버튼 ========== */}
            <div className="main-hero-left">
                {/* 제목 영역 (재생 버튼 + 텍스트) */}
                <div className="main-hero-title-wrap">
                    {/* 재생 버튼 (시각적 요소, 실제 기능 없음) */}
                    <button className="main-play-circle">▶</button>

                    <div>
                        {/* 
                          제목: props로 받은 title 또는 기본값 "K-pop Chart" 
                          || 연산자로 falsy 값 처리
                        */}
                        <h1 className="main-hero-title">{title || "K-pop Chart"}</h1>

                        {/* 설명 텍스트 */}
                        <p className="main-hero-desc">
                            이번 달의 가장 핫한 트랙들을 소개해드려요!
                        </p>
                    </div>
                </div>

                {/* 탭/버튼 영역 */}
                <div className="main-tabs">
                    {/* 
                      검색 버튼: 클릭 시 onSearchClick 핸들러 실행
                      보통 노래 목록 페이지(/songs)로 이동
                    */}
                    <button className="main-tab main-tab--active" onClick={onSearchClick}>
                        검색하기
                    </button>
                </div>
            </div>

            {/* ========== 오른쪽 영역: 앨범 커버 이미지 ========== */}
            <div className="main-hero-artwork">
                {/* 
                  두 개의 앨범 커버를 겹쳐서 표시
                  
                  레이어 순서:
                  1. cover2 (뒤, 2위 곡)
                  2. cover1 (앞, 1위 곡, 기울어짐 효과 적용)
                  
                  CSS에서 position과 transform으로 겹침 효과 구현
                */}

                {/* 뒤에 있는 카드 (2위) */}
                {cover2 ? (
                    <img
                        src={cover2}
                        alt="Rank 2"
                        className="main-art-card"
                    />
                ) : (
                    /* 이미지가 없을 때 플레이스홀더 */
                    <div className="main-art-card" style={{ background: '#333' }}>2nd</div>
                )}

                {/* 앞에 튀어나온 카드 (1위) - tilt 클래스로 기울어짐 효과 적용 */}
                {cover1 ? (
                    <img
                        src={cover1}
                        alt="Rank 1"
                        className="main-art-card main-art-card--tilt"
                    />
                ) : (
                    /* 이미지가 없을 때 플레이스홀더 */
                    <div className="main-art-card main-art-card--tilt" style={{ background: '#555' }}>1st</div>
                )}
            </div>
        </section>
    );
};

export default Hero;