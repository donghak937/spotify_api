import React, { useEffect, useState } from "react";
import './MainPage.css';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import ChartPage from './ChartPage';
import SongList from './SongList';
import LoginPage from './LoginPage';
import MyPlaylistPage from './MyPlaylistPage';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function MainPage() {
  const [user, setUser] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Load playlist from Firestore
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setMyPlaylist(userDoc.data().playlist || []);
        } else {
          // Create user doc if not exists
          try {
            await setDoc(userDocRef, { playlist: [] });
            setMyPlaylist([]);
          } catch (e) {
            console.error("Error creating user doc:", e);
            // Fallback for when DB is not ready or permissions fail
            setMyPlaylist([]);
          }
        }
      } else {
        setUser(null);
        setMyPlaylist([]);
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

  return (
    <div className="main-page">
      {/* 최상단 네비바 */}
      <Header user={user} />

      {/* 메인 컨텐츠 */}
      <main className="main-main">
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/songs" element={<SongList onAdd={addToPlaylist} />} />
          <Route path="/playlist" element={<MyPlaylistPage playlist={myPlaylist} onRemove={removeFromPlaylist} user={user} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default MainPage;
