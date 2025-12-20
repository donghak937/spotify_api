/**
 * @file MainPage.js
 * @description 앱의 메인 레이아웃 및 라우팅을 담당하는 최상위 페이지 컴포넌트
 * 
 * 이 컴포넌트는 다음 역할을 수행합니다:
 * 1. 전체 앱 레이아웃 관리 (헤더 + 메인 컨텐츠)
 * 2. React Router를 통한 페이지 라우팅
 * 3. 사용자 인증 상태 관리
 * 4. 플레이리스트 및 메모 상태 관리 (Firestore 연동)
 * 5. 트랙 선택 모달 관리
 */

import React, { useEffect, useState } from "react";
import './MainPage.css';

// React Router - 페이지 라우팅
import { Routes, Route } from 'react-router-dom';

// 컴포넌트 import
import Header from './component/Header';          // 상단 네비게이션 헤더
import HomePage from './HomePage';               // 메인 홈페이지
import ChartPage from './ChartPage';             // 차트 페이지
import SongList from './SongList';               // 노래 목록 페이지
import LoginPage from './LoginPage';             // 로그인 페이지
import MyPlaylistPage from './MyPlaylistPage';   // 내 플레이리스트 페이지
import DeveloperPage from './DeveloperPage';     // 개발자 정보 페이지
import SongModal from './component/SongModal';   // 곡 상세정보 모달

// Firebase import
import { auth, db } from './firebase';           // Firebase 인스턴스
import { onAuthStateChanged } from 'firebase/auth';  // 로그인 상태 감지
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';  // Firestore 함수들

/**
 * MainPage 컴포넌트
 * 
 * 앱 전체를 감싸는 최상위 컴포넌트로, 모든 상태와 핸들러를 관리합니다.
 * 
 * @component
 * @returns {JSX.Element} 메인 페이지 컴포넌트
 */
function MainPage() {
  // ============================================================
  // ======================== 상태 정의 ==========================
  // ============================================================

  /**
   * 현재 로그인한 사용자 정보
   * @type {Object|null}
   * - null: 로그인되지 않음
   * - Object: Firebase User 객체 (uid, email, displayName 등 포함)
   */
  const [user, setUser] = useState(null);

  /**
   * 사용자의 플레이리스트 (저장한 곡들)
   * @type {Array<Track>}
   * - 각 Track 객체는 id, title, artist, cover 등의 속성을 가짐
   * - Firestore의 users/{uid}/playlist에서 불러옴
   */
  const [myPlaylist, setMyPlaylist] = useState([]);

  /**
   * 곡별 메모 데이터
   * @type {Object.<string, string>}
   * - 키: 트랙 ID
   * - 값: 메모 내용
   * - 예: { "spotify_track_123": "최고의 곡!" }
   */
  const [memos, setMemos] = useState({}); // Memo state: { trackId: "text" }

  /**
   * 현재 모달에 표시 중인 트랙
   * @type {Track|null}
   * - null: 모달 닫힘
   * - Track: 해당 곡의 상세정보 모달 열림
   */
  const [selectedTrack, setSelectedTrack] = useState(null);

  // ============================================================
  // =================== 인증 상태 감지 (useEffect) ===============
  // ============================================================

  /**
   * Firebase 인증 상태 변화 감지
   * 
   * - 로그인 시: Firestore에서 사용자 데이터(playlist, memos) 불러오기
   * - 로그아웃 시: 상태 초기화
   * 
   * onAuthStateChanged는 다음 상황에서 호출됩니다:
   * 1. 페이지 로드 시 (기존 세션 확인)
   * 2. 로그인 성공 시
   * 3. 로그아웃 시
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // ===== 로그인 상태 =====
        setUser(authUser);

        // Firestore에서 사용자 데이터 불러오기
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // 기존 사용자: 저장된 데이터 로드
          const data = userDoc.data();
          setMyPlaylist(data.playlist || []);
          setMemos(data.memos || {});
        } else {
          // 신규 사용자: 빈 문서 생성
          try {
            await setDoc(userDocRef, { playlist: [], memos: {} });
            setMyPlaylist([]);
            setMemos({});
          } catch (e) {
            console.error("Error creating user doc:", e);
            setMyPlaylist([]);
            setMemos({});
          }
        }
      } else {
        // ===== 로그아웃 상태 =====
        setUser(null);
        setMyPlaylist([]);
        setMemos({});
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  // ============================================================
  // ================== 플레이리스트 관리 함수들 ==================
  // ============================================================

  /**
   * 플레이리스트에 곡 추가
   * 
   * @async
   * @param {Track} track - 추가할 트랙 객체
   * @returns {Promise<void>}
   * 
   * 1. 로그인 확인 (미로그인 시 로그인 페이지로 이동)
   * 2. 중복 확인 (이미 있으면 알림)
   * 3. 로컬 상태 업데이트
   * 4. Firestore에 저장 (arrayUnion 사용)
   */
  const addToPlaylist = async (track) => {
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
      return;
    }

    // 중복 체크 (ID 기준)
    if (!myPlaylist.find((item) => item.id === track.id)) {
      // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
      const newPlaylist = [...myPlaylist, track];
      setMyPlaylist(newPlaylist);

      // Firestore에 저장
      const userDocRef = doc(db, "users", user.uid);
      try {
        // arrayUnion: 배열에 요소 추가 (중복 시 무시)
        await updateDoc(userDocRef, {
          playlist: arrayUnion(track)
        });
        alert("Added to My Playlist!");
      } catch (e) {
        console.error("Error adding to playlist:", e);
        alert("저장에 실패했습니다. 데이터베이스 설정을 확인해주세요.");
      }
    } else {
      alert("Already in My Playlist!");
    }
  };

  /**
   * 플레이리스트에 여러 곡 한번에 추가
   * 
   * @async
   * @param {Track[]} tracks - 추가할 트랙 배열
   * @returns {Promise<void>}
   * 
   * SongList에서 다중 선택 후 일괄 추가할 때 사용
   */
  const addMultipleToPlaylist = async (tracks) => {
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
      return;
    }

    // 이미 플레이리스트에 있는 곡 제외
    const newTracks = tracks.filter(t => !myPlaylist.some(p => p.id === t.id));

    if (newTracks.length === 0) {
      alert("이미 모든 곡이 플레이리스트에 있습니다.");
      return;
    }

    // 로컬 상태 업데이트
    const updatedPlaylist = [...myPlaylist, ...newTracks];
    setMyPlaylist(updatedPlaylist);

    // Firestore에 저장 (전체 배열 교체)
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        playlist: updatedPlaylist
      });
      alert(`${newTracks.length}곡이 플레이리스트에 추가되었습니다.`);
    } catch (e) {
      console.error("Error bulk adding to playlist:", e);
      alert("저장에 실패했습니다.");
    }
  };

  /**
   * 플레이리스트에서 곡 삭제
   * 
   * @async
   * @param {string} trackId - 삭제할 트랙의 ID
   * @returns {Promise<void>}
   */
  const removeFromPlaylist = async (trackId) => {
    // 삭제할 트랙 객체 찾기 (Firestore의 arrayRemove에 필요)
    const trackToRemove = myPlaylist.find((t) => t.id === trackId);

    // 로컬 상태에서 제거
    const newPlaylist = myPlaylist.filter((track) => track.id !== trackId);
    setMyPlaylist(newPlaylist);

    // Firestore에서 제거
    if (trackToRemove && user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        // arrayRemove: 배열에서 특정 요소 제거
        await updateDoc(userDocRef, {
          playlist: arrayRemove(trackToRemove)
        });
      } catch (e) {
        console.error("Error removing from playlist:", e);
      }
    }
  };

  /**
   * 플레이리스트에서 여러 곡 한번에 삭제
   * 
   * @async
   * @param {string[]} trackIds - 삭제할 트랙 ID 배열
   * @returns {Promise<void>}
   * 
   * MyPlaylistPage에서 다중 선택 후 일괄 삭제할 때 사용
   */
  const removeMultipleFromPlaylist = async (trackIds) => {
    // 삭제할 트랙들 찾기
    const tracksToRemove = myPlaylist.filter((t) => trackIds.includes(t.id));

    // 로컬 상태에서 제거
    const newPlaylist = myPlaylist.filter((t) => !trackIds.includes(t.id));
    setMyPlaylist(newPlaylist);

    // Firestore에서 제거
    if (user && tracksToRemove.length > 0) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        // 간단히 전체 배열을 교체
        await updateDoc(userDocRef, {
          playlist: newPlaylist // Just replace the whole list for simplicity in bulk
        });
        alert(`${tracksToRemove.length}곡이 삭제되었습니다.`);
      } catch (e) {
        console.error("Error bulk removing from playlist:", e);
      }
    }
  };

  // ============================================================
  // ===================== 모달 관련 함수들 ======================
  // ============================================================

  /**
   * 트랙 클릭 시 모달 열기
   * 
   * @param {Track} track - 클릭된 트랙 객체
   */
  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

  /**
   * 모달 닫기
   */
  const closeModal = () => {
    setSelectedTrack(null);
  };

  // ============================================================
  // ======================== 메모 저장 ==========================
  // ============================================================

  /**
   * 곡에 메모 저장
   * 
   * @async
   * @param {string} trackId - 트랙 ID
   * @param {string} text - 메모 내용
   * @returns {Promise<void>}
   * 
   * SongModal에서 메모 작성 후 Save 버튼 클릭 시 호출
   */
  const handleSaveMemo = async (trackId, text) => {
    // 로그인 필수
    if (!user) return;

    // 로컬 상태 업데이트
    const newMemos = { ...memos, [trackId]: text };
    setMemos(newMemos);

    // Firestore에 저장
    // 점 표기법으로 중첩 필드 업데이트: memos.trackId
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        [`memos.${trackId}`]: text
      });
      alert("메모가 저장되었습니다!");
    } catch (e) {
      console.error("Error saving memo:", e);
      alert("메모 저장 실패");
    }
  };

  // ============================================================
  // ========================== 렌더링 ===========================
  // ============================================================

  return (
    <div className="main-page">
      {/* ========== 최상단 네비게이션 바 ========== */}
      <Header user={user} />

      {/* ========== 메인 컨텐츠 영역 ========== */}
      <main className="main-main">
        {/* 
          React Router Routes
          
          각 Route는 URL 경로에 따라 다른 컴포넌트를 렌더링합니다.
          하위 페이지들에 필요한 함수들을 props로 전달합니다.
        */}
        <Routes>
          {/* 홈페이지 (/) */}
          <Route path="/" element={<HomePage onTrackClick={handleTrackClick} />} />

          {/* 차트 페이지 (/charts) */}
          <Route path="/charts" element={<ChartPage onTrackClick={handleTrackClick} />} />

          {/* 개발자 정보 페이지 (/developers) */}
          <Route path="/developers" element={<DeveloperPage />} />

          {/* 노래 목록 페이지 (/songs) */}
          <Route path="/songs" element={
            <SongList
              onAdd={addToPlaylist}           // 단일 곡 추가 핸들러
              onAddMultiple={addMultipleToPlaylist}  // 다중 곡 추가 핸들러
              onTrackClick={handleTrackClick}  // 트랙 클릭 핸들러
            />
          } />

          {/* 내 플레이리스트 페이지 (/playlist) */}
          <Route path="/playlist" element={
            <MyPlaylistPage
              playlist={myPlaylist}           // 플레이리스트 데이터
              memos={memos}                   // 메모 데이터
              onRemove={removeFromPlaylist}   // 단일 삭제 핸들러
              onRemoveMultiple={removeMultipleFromPlaylist}  // 다중 삭제 핸들러
              user={user}                     // 사용자 정보
              onTrackClick={handleTrackClick}  // 트랙 클릭 핸들러
            />}
          />

          {/* 로그인 페이지 (/login) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 개발자 페이지 중복 정의 (안전장치) */}
          <Route path="/developers" element={<DeveloperPage />} />
        </Routes>
      </main>

      {/* ========== 곡 상세정보 모달 ========== */}
      {/* selectedTrack이 있을 때만 모달 표시 */}
      {selectedTrack && (
        <SongModal
          track={selectedTrack}           // 표시할 트랙 정보
          onClose={closeModal}            // 닫기 핸들러
          user={user}                     // 사용자 정보 (메모 수정 권한 확인용)
          memo={memos[selectedTrack.id] || ""}  // 해당 곡의 메모
          onSaveMemo={handleSaveMemo}     // 메모 저장 핸들러

          // 플레이리스트 저장 여부 (버튼 텍스트 변경용)
          isSaved={myPlaylist.some(t => t.id === selectedTrack.id)}

          // 플레이리스트 토글 핸들러 (추가/삭제)
          onTogglePlaylist={() => {
            const exists = myPlaylist.some(t => t.id === selectedTrack.id);
            if (exists) {
              removeFromPlaylist(selectedTrack.id); // 이미 있으면 삭제
            } else {
              addToPlaylist(selectedTrack); // 없으면 추가
            }
          }}
        />
      )}
    </div>
  );
}

export default MainPage;
