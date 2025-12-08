import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../MainPage.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleChartClick = () => navigate('/');
    const handleSongListClick = () => navigate('/songs');

    return (
        <header className="main-header">
            <div className="main-header-left">
                <div className="main-logo" onClick={handleChartClick} style={{ cursor: 'pointer' }}>OSS MUSIC</div>

                <nav className="main-nav">
                    <button className="main-nav-item" onClick={handleChartClick}>앱 제작자</button>
                    <button className={`main-nav-item ${location.pathname === '/songs' ? 'active' : ''}`} onClick={handleSongListClick}>노래 목록</button>
                    <button className={`main-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={handleChartClick}>차트</button>
                    <button className="main-nav-item">내 플레이 리스트</button>
                </nav>
            </div>

            <div className="main-header-right">
                <button className="main-apple-btn">로그인</button>
            </div>
        </header>
    );
};

export default Header;
