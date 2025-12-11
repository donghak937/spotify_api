import React, { useEffect, useState } from "react";
import './MainPage.css';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import HomePage from './HomePage'; // 새로 만든 메인 홈페이지
import ChartPage from './ChartPage';
import SongList from './SongList';
import LoginPage from './LoginPage';
import MyPlaylistPage from './MyPlaylistPage';
import SongModal from './component/SongModal';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function MainPage() {
  const [user, setUser] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [memos, setMemos] = useState({}); // Memo state: { trackId: "text" }
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Load playlist & memos from Firestore
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setMyPlaylist(data.playlist || []);
          setMemos(data.memos || {});
        } else {
          // Create user doc if not exists
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
        setUser(null);
        setMyPlaylist([]);
        setMemos({});
      }
    });

    return () => unsubscribe();
  }, []);

  const addToPlaylist = async (track) => {
    if (!user) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
      return;
    }
    // 중복 제거
    if (!myPlaylist.find((item) => item.id === track.id)) {
      const newPlaylist = [...myPlaylist, track];
      setMyPlaylist(newPlaylist);

      // Save to Firestore
      const userDocRef = doc(db, "users", user.uid);
      try {
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

  const removeFromPlaylist = async (trackId) => {
    const trackToRemove = myPlaylist.find((t) => t.id === trackId);
    const newPlaylist = myPlaylist.filter((track) => track.id !== trackId);
    setMyPlaylist(newPlaylist);

    if (trackToRemove && user) {
      // Remove from Firestore
      const userDocRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userDocRef, {
          playlist: arrayRemove(trackToRemove)
        });
      } catch (e) {
        console.error("Error removing from playlist:", e);
      }
    }
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

  const closeModal = () => {
    setSelectedTrack(null);
  };

  const handleSaveMemo = async (trackId, text) => {
    if (!user) return;

    // Update local state
    const newMemos = { ...memos, [trackId]: text };
    setMemos(newMemos);

    // Save to Firestore
    const userDocRef = doc(db, "users", user.uid);
    try {
      // Use dot notation to update specific map field or replace entire map?
      // Easiest is to update the entire 'memos' field to avoid complex dot notation for dynamic keys in updateDoc if not using Map.
      // Actually Firestore updateDoc allows "memos.trackId": text
      await updateDoc(userDocRef, {
        [`memos.${trackId}`]: text
      });
      alert("메모가 저장되었습니다!");
    } catch (e) {
      console.error("Error saving memo:", e);
      alert("메모 저장 실패");
    }
  };

  return (
    <div className="main-page">
      {/* 최상단 네비바 */}
      <Header user={user} />

      {/* 메인 컨텐츠 */}
      <main className="main-main">
        <Routes>
          <Route path="/" element={<HomePage onTrackClick={handleTrackClick} />} />
          <Route path="/charts" element={<ChartPage onTrackClick={handleTrackClick} />} />
          <Route path="/songs" element={<SongList onAdd={addToPlaylist} onTrackClick={handleTrackClick} />} />
          <Route path="/playlist" element={<MyPlaylistPage playlist={myPlaylist} onRemove={removeFromPlaylist} user={user} onTrackClick={handleTrackClick} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* Song Modal */}
      {selectedTrack && (
        <SongModal
          track={selectedTrack}
          onClose={closeModal}
          user={user}
          memo={memos[selectedTrack.id] || ""}
          onSaveMemo={handleSaveMemo}
        />
      )}
    </div>
  );
}

export default MainPage;
