/**
 * @file DeveloperPage.js
 * @description 개발자 정보 페이지 - 프로젝트 및 팀원 정보 표시
 * 
 * 이 페이지는 정적 컨텐츠로 구성되어 있습니다:
 * - 프로젝트 제목 (OSS PROJECT)
 * - 팀 이름 (Team 06)
 * - 개발자 정보 (이름 및 학번)
 */

import React from 'react';

/**
 * DeveloperPage 컴포넌트
 * 
 * 프로젝트 정보와 개발자 정보를 보여주는 페이지
 * 상태가 없는 순수 프레젠테이션 컴포넌트
 * 
 * @component
 * @returns {JSX.Element} 개발자 정보 페이지 컴포넌트
 */
function DeveloperPage() {
    return (
        <div style={{
            // 전체 높이에서 헤더 높이를 제외한 영역에 중앙 정렬
            height: 'calc(100vh - 64px)', // 헤더 높이 제외
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white',
            textAlign: 'center'
        }}>
            {/* ========== 메인 카드 컨테이너 ========== */}
            <div style={{
                // 글래스모피즘 효과의 카드 스타일
                background: 'rgba(255, 255, 255, 0.05)', // 반투명 배경
                padding: '60px 100px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)', // 얇은 테두리
                backdropFilter: 'blur(10px)', // 흐림 효과 (글래스모피즘)
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)' // 깊은 그림자
            }}>
                {/* ===== 프로젝트 제목 ===== */}
                <h1 style={{
                    fontSize: '50px',
                    fontWeight: '900',
                    marginBottom: '10px',
                    color: '#1db954', // 스포티파이 그린 포인트 컬러
                    letterSpacing: '-1px' // 글자 간격 조정
                }}>
                    OSS PROJECT
                </h1>

                {/* ===== 팀 이름 ===== */}
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '300', // 얇은 폰트
                    marginBottom: '50px',
                    opacity: '0.8' // 살짝 투명하게
                }}>
                    Team 06
                </h2>

                {/* ===== 개발자 정보 영역 ===== */}
                <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    lineHeight: '2', // 줄 간격 넓게
                    borderTop: '1px solid rgba(255,255,255,0.2)', // 상단 구분선
                    paddingTop: '30px'
                }}>
                    {/* 팀원 1 */}
                    <div>박성준 (22200293)</div>
                    {/* 팀원 2 */}
                    <div>김동하 (22200066)</div>
                </div>
            </div>
        </div>
    );
}

export default DeveloperPage;