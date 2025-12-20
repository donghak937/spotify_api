/**
 * @file Banner.jsx
 * @description 프로모션 배너 컴포넌트
 * 
 * 플레이리스트 기능을 홍보하는 배너입니다.
 * 클릭 시 플레이리스트 페이지로 이동합니다.
 * 
 * 현재 앱에서 사용되지 않지만, 필요 시 홈페이지 등에 추가할 수 있습니다.
 */

import React from 'react';

// React Router - 페이지 이동
import { useNavigate } from 'react-router-dom';

// 스타일
import '../MainPage.css';

/**
 * Banner 컴포넌트
 * 
 * 플레이리스트 페이지로 유도하는 프로모션 배너
 * 
 * @component
 * @returns {JSX.Element} 배너 컴포넌트
 * 
 * @example
 * // 홈페이지 하단에 배치 예시
 * <HomePage>
 *   ...
 *   <Banner />
 * </HomePage>
 */
const Banner = () => {
    // 페이지 이동 함수
    const navigate = useNavigate();

    return (
        <div className="main-banner">
            {/* ========== 배너 텍스트 영역 ========== */}
            <div className="main-banner-text">
                {/* 배너 제목 */}
                <h2>나만의 플레이리스트 만들기</h2>

                {/* 배너 설명 */}
                <p>좋아하는 곡을 담아 언제 어디서든 감상해보세요.</p>
            </div>

            {/* ========== 배너 버튼 ========== */}
            {/* 클릭 시 플레이리스트 페이지로 이동 */}
            <button className="main-banner-btn" onClick={() => navigate('/playlist')}>
                보러가기
            </button>
        </div>
    );
};

export default Banner;