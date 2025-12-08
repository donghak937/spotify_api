import React from "react";
import './MainPage.css';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import ChartPage from './ChartPage';
import SongList from './SongList';

function MainPage() {
  return (
    <div className="main-page">
      {/* 최상단 네비바 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="main-hero-section">
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/songs" element={<SongList />} />
        </Routes>
      </main>
    </div>
  );
}

export default MainPage;
