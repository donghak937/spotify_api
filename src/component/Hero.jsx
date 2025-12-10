import React from 'react';
import '../MainPage.css';

const Hero = ({ onSearchClick }) => {
    return (
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
                    <button className="main-tab main-tab--active" onClick={onSearchClick}>검색하기</button>
                </div>
            </div>

            <div className="main-hero-artwork">
                <div className="main-art-card">Album</div>
                <div className="main-art-card main-art-card--tilt">Cover</div>
            </div>
        </section>
    );
};

export default Hero;
