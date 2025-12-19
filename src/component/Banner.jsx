import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../MainPage.css';

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className="main-banner">
            <div className="main-banner-text">
                <h2>나만의 플레이리스트 만들기</h2>
                <p>좋아하는 곡을 담아 언제 어디서든 감상해보세요.</p>
            </div>
            <button className="main-banner-btn" onClick={() => navigate('/playlist')}>
                보러가기
            </button>
        </div>
    );
};

export default Banner;