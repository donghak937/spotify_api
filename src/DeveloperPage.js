import React from 'react';

function DeveloperPage() {
    return (
        <div style={{
            height: 'calc(100vh - 64px)', // 헤더 높이 제외
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white',
            textAlign: 'center'
        }}>
            {/* 카드 컨테이너 */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)', // 반투명 배경
                padding: '60px 100px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)', // 얇은 테두리
                backdropFilter: 'blur(10px)', // 흐림 효과
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {/* 프로젝트 제목 */}
                <h1 style={{ 
                    fontSize: '50px', 
                    fontWeight: '900', 
                    marginBottom: '10px',
                    color: '#1db954', // 스포티파이 그린 포인트
                    letterSpacing: '-1px'
                }}>
                    OSS PROJECT
                </h1>

                {/* 조 이름 */}
                <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: '300', 
                    marginBottom: '50px', 
                    opacity: '0.8' 
                }}>
                    Team 06
                </h2>
                
                {/* 이름 및 학번 영역 */}
                <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    lineHeight: '2',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    paddingTop: '30px'
                }}>
                    <div>박성준 (22200293)</div>
                    <div>김동하 (22200066)</div>
                </div>
            </div>
        </div>
    );
}

export default DeveloperPage;