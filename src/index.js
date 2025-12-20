/**
 * @file index.js
 * @description React 애플리케이션의 진입점 (Entry Point)
 * 
 * 이 파일은 React 앱이 시작되는 최초의 파일입니다.
 * HTML의 'root' 요소에 React 컴포넌트를 렌더링합니다.
 */

// React 라이브러리 import
import React from 'react';

// React 18+ 버전의 새로운 렌더링 API
import ReactDOM from 'react-dom/client';

// 전역 스타일 시트 (body, 기본 폰트 등)
import './index.css';

// 메인 애플리케이션 컴포넌트
import MainPage from './MainPage';

// React Router의 브라우저 라우터
// BrowserRouter는 HTML5 History API를 사용하여 URL을 관리합니다
import { BrowserRouter } from 'react-router-dom';

/**
 * React 애플리케이션 렌더링
 * 
 * 1. document.getElementById('root')로 public/index.html의 root div를 찾음
 * 2. createRoot()로 React 18의 Concurrent Mode 활성화
 * 3. render()로 컴포넌트 트리 렌더링
 * 
 * 컴포넌트 구조:
 * - React.StrictMode: 개발 모드에서 잠재적 문제를 감지
 * - BrowserRouter: 클라이언트 사이드 라우팅 활성화
 * - MainPage: 실제 애플리케이션 컴포넌트
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BrowserRouter로 감싸야 useNavigate, Routes 등을 사용할 수 있음 */}
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  </React.StrictMode>
);