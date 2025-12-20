/**
 * @file LoginPage.js
 * @description Google 소셜 로그인을 처리하는 로그인 페이지 컴포넌트
 * 
 * 기능:
 * - Google 계정으로 Firebase 인증
 * - 로그인 성공 시 홈페이지(/)로 자동 리다이렉트
 * - 이미 로그인된 경우 홈페이지로 리다이렉트
 */

import React, { useEffect } from 'react';

// 로그인 페이지 전용 스타일
import './LoginPage.css';

// Firebase 인증 관련 import
import { auth, googleProvider } from './firebase';  // Firebase 인스턴스
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';  // 인증 함수

// React Router - 페이지 이동
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage 컴포넌트
 * 
 * 사용자가 Google 계정으로 로그인할 수 있는 페이지입니다.
 * 
 * @component
 * @returns {JSX.Element} 로그인 페이지 컴포넌트
 */
function LoginPage() {
    // 페이지 이동을 위한 navigate 함수
    const navigate = useNavigate();

    /**
     * 인증 상태 변화 감지
     * 
     * 이미 로그인된 사용자가 로그인 페이지에 접근하면
     * 자동으로 홈페이지(/)로 리다이렉트합니다.
     * 
     * 이 효과는 다음 상황에서 실행됩니다:
     * 1. 페이지 로드 시 (세션 쿠키로 자동 로그인 확인)
     * 2. 로그인 성공 시 (user 상태 변경)
     */
    useEffect(() => {
        // Firebase 인증 상태 리스너 등록
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // 로그인 상태면 홈으로 이동
                navigate('/');
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        // 메모리 누수 방지를 위해 반드시 필요
        return () => unsubscribe();
    }, [navigate]);  // navigate가 변경될 때마다 재실행 (사실상 한 번만 실행)

    /**
     * Google 로그인 처리
     * 
     * signInWithPopup()은 새 창을 열어 Google 로그인 UI를 표시합니다.
     * 사용자가 계정을 선택하면 Firebase에 인증 정보가 저장됩니다.
     * 
     * 성공 시: 콘솔에 사용자 정보 출력 (onAuthStateChanged가 리다이렉트 처리)
     * 실패 시: 에러 메시지 alert 표시
     */
    const signIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // 로그인 성공
                // result.user에 사용자 정보가 담겨있음
                // (uid, email, displayName, photoURL 등)
                console.log("Login Success", result.user);
                // 리다이렉트는 위의 onAuthStateChanged에서 처리됨
            })
            .catch((error) => {
                // 로그인 실패 (팝업 닫기, 네트워크 오류 등)
                alert(error.message);
            });
    };

    /**
     * 렌더링
     * 
     * 간단한 로그인 UI:
     * - 앱 로고 (OSS MUSIC)
     * - Google 로그인 버튼
     */
    return (
        <div className="login">
            {/* 앱 로고 */}
            <h1 className="login-logo">OSS MUSIC</h1>

            {/* Google 로그인 버튼 */}
            {/* eslint-disable-next-line: 접근성 경고 무시 (버튼 사용) */}
            <button onClick={signIn} className="login-btn">SIGN IN WITH GOOGLE</button>
        </div>
    );
}

export default LoginPage;
