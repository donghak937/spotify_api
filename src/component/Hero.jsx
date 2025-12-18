import React from 'react';
import '../MainPage.css';

// props에 cover1, cover2 추가
const Hero = ({ onSearchClick, title, cover1, cover2 }) => {
    return (
        <section className="main-hero">
            <div className="main-hero-left">
                <div className="main-hero-title-wrap">
                    <button className="main-play-circle">▶</button>
                    <div>
                        {/* 제목도 props로 받은 title 사용 */}
                        <h1 className="main-hero-title">{title || "K-pop Chart"}</h1>
                        <p className="main-hero-desc">
                            이번 달의 가장 핫한 트랙들을 소개해드려요!
                        </p>
                    </div>
                </div>

                <div className="main-tabs">
                    <button className="main-tab main-tab--active" onClick={onSearchClick}>검색하기</button>
                </div>
            </div>

            {/* ▼▼▼ 앨범 커버 이미지 표시 영역 수정 ▼▼▼ */}
            <div className="main-hero-artwork">
                {/* 뒤에 있는 카드 (2위) */}
                {cover2 ? (
                    <img src={cover2} alt="Rank 2" className="main-art-card" />
                ) : (
                    <div className="main-art-card" style={{ background: '#333' }}>2nd</div>
                )}

                {/* 앞에 튀어나온 카드 (1위) - tilt 클래스 유지 */}
                {cover1 ? (
                    <img src={cover1} alt="Rank 1" className="main-art-card main-art-card--tilt" />
                ) : (
                    <div className="main-art-card main-art-card--tilt" style={{ background: '#555' }}>1st</div>
                )}
            </div>
        </section>
    );
};

export default Hero;