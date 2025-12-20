/**
 * @file Header.jsx
 * @description 앱 상단 네비게이션 헤더 컴포넌트
 * 
 * 헤더에 포함된 요소:
 * - 앱 로고 (OSS MUSIC) - 클릭 시 홈으로 이동
 * - 네비게이션 메뉴 (홈, 앱 제작자, 노래 목록, 차트, 내 플레이리스트)
 * - 로그인/로그아웃 버튼
 * 
 * 현재 위치에 따라 해당 메뉴가 활성화(active) 상태로 표시됩니다.
 */

import React from 'react';

// React Router - 페이지 이동 및 현재 위치 확인
import { useNavigate, useLocation } from 'react-router-dom';

// 스타일
import '../MainPage.css';

// Firebase 인증
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

/**
 * Header 컴포넌트
 * 
 * 앱 전체에서 항상 표시되는 상단 네비게이션 바
 * 
 * @component
 * @param {Object} props
 * @param {Object|null} props.user - 현재 로그인한 사용자 (null이면 비로그인 상태)
 * @returns {JSX.Element} 헤더 컴포넌트
 * 
 * @example
 * <Header user={user} />
 */
const Header = ({ user }) => {
    // ============================================================
    // ======================= 훅 설정 =============================
    // ============================================================

    /**
     * 페이지 이동 함수
     * navigate('/path')로 특정 경로로 이동
     */
    const navigate = useNavigate();

    /**
     * 현재 URL 위치 정보
     * location.pathname으로 현재 경로 확인 가능
     * 예: '/', '/charts', '/songs', '/playlist'
     */
    const location = useLocation();

    // ============================================================
    // =================== 네비게이션 핸들러 =======================
    // ============================================================

    /**
     * 각 메뉴 버튼의 클릭 핸들러
     * navigate() 함수로 해당 경로로 이동
     */
    const handleHomeClick = () => navigate('/');       // 메인 홈
    const handleChartClick = () => navigate('/charts'); // 차트 전용 페이지
    const handleSongListClick = () => navigate('/songs');
    const handlePlaylistClick = () => navigate('/playlist');
    const handleDeveloperClick = () => navigate('/developers');

    /**
     * 로그아웃 핸들러
     * 
     * Firebase signOut() 함수를 호출하여 로그아웃 처리
     * 성공 시 알림, 실패 시 에러 메시지 표시
     */
    const handleLogout = () => {
        signOut(auth).then(() => {
            alert("Signed out successfully");
            // MainPage의 onAuthStateChanged에서 user 상태가 null로 변경됨
        }).catch((error) => {
            alert("Error signing out: " + error.message);
        });
    };

    // ============================================================
    // ========================= 렌더링 ============================
    // ============================================================

    return (
        <header className="main-header">
            {/* ========== 왼쪽 영역: 로고 + 네비게이션 ========== */}
            <div className="main-header-left">
                {/* 앱 로고 - 클릭 시 홈으로 이동 */}
                <div
                    className="main-logo"
                    onClick={handleHomeClick}
                    style={{ cursor: 'pointer' }}
                >
                    OSS MUSIC
                </div>

                {/* 네비게이션 메뉴 */}
                <nav className="main-nav">
                    {/* 
                      각 버튼에 현재 경로와 일치하면 'active' 클래스 추가
                      CSS에서 active 클래스에 다른 스타일이 적용됨
                    */}

                    {/* 홈 버튼 (경로: /) */}
                    <button
                        className={`main-nav-item ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={handleHomeClick}
                    >
                        홈
                    </button>

                    {/* 앱 제작자 버튼 (경로: /developers) */}
                    <button
                        className={`main-nav-item ${location.pathname === '/developers' ? 'active' : ''}`}
                        onClick={handleDeveloperClick}
                    >
                        앱 제작자
                    </button>

                    {/* 노래 목록 버튼 (경로: /songs) */}
                    <button
                        className={`main-nav-item ${location.pathname === '/songs' ? 'active' : ''}`}
                        onClick={handleSongListClick}
                    >
                        노래 목록
                    </button>

                    {/* 차트 버튼 (경로: /charts) */}
                    <button
                        className={`main-nav-item ${location.pathname === '/charts' ? 'active' : ''}`}
                        onClick={handleChartClick}
                    >
                        차트
                    </button>

                    {/* 내 플레이리스트 버튼 (경로: /playlist) */}
                    <button
                        className={`main-nav-item ${location.pathname === '/playlist' ? 'active' : ''}`}
                        onClick={handlePlaylistClick}
                    >
                        내 플레이 리스트
                    </button>
                </nav>
            </div>

            {/* ========== 오른쪽 영역: 인증 버튼 ========== */}
            <div className="main-header-right">
                {user ? (
                    /* 로그인 상태: 로그아웃 버튼 (분홍색) */
                    <button
                        className="main-apple-btn"
                        onClick={handleLogout}
                        style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                    >
                        로그아웃
                    </button>
                ) : (
                    /* 비로그인 상태: 로그인 버튼 */
                    <button
                        className="main-apple-btn"
                        onClick={() => navigate('/login')}
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
