import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../MainPage.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleHomeClick = () => navigate('/');       // 메인 홈
    const handleChartClick = () => navigate('/charts'); // 차트 전용 페이지
    const handleSongListClick = () => navigate('/songs');
    const handlePlaylistClick = () => navigate('/playlist');

    const handleLogout = () => {
        signOut(auth).then(() => {
            alert("Signed out successfully");
        }).catch((error) => {
            alert("Error signing out: " + error.message);
        });
    };

    return (
        <header className="main-header">
            <div className="main-header-left">
                <div className="main-logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>OSS MUSIC</div>

                <nav className="main-nav">
                    <button className={`main-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={handleHomeClick}></button>
                    <button className="main-nav-item" onClick={handleChartClick}>앱 제작자</button>
                    <button className={`main-nav-item ${location.pathname === '/songs' ? 'active' : ''}`} onClick={handleSongListClick}>노래 목록</button>
                    <button className={`main-nav-item ${location.pathname === '/charts' ? 'active' : ''}`} onClick={handleChartClick}>차트</button>
                    <button className={`main-nav-item ${location.pathname === '/playlist' ? 'active' : ''}`} onClick={handlePlaylistClick}>내 플레이 리스트</button>
                </nav>
            </div>

            <div className="main-header-right">
                {user ? (
                    <button className="main-apple-btn" onClick={handleLogout} style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}>로그아웃</button>
                ) : (
                    <button className="main-apple-btn" onClick={() => navigate('/login')}>로그인</button>
                )}
            </div>
        </header>
    );
};

export default Header;
