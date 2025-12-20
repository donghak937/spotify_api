# 🎵 OSS MUSIC - Spotify API 기반 음악 플랫폼

> **Team 06** | 박성준 (22200293), 김동하 (22200066)

OSS MUSIC은 Spotify API와 Firebase를 활용한 음악 스트리밍 웹 애플리케이션입니다. 사용자는 다양한 장르의 음악을 탐색하고, 개인 플레이리스트를 생성하며, 각 곡에 메모를 남길 수 있습니다.

---

## 📋 목차

1. [주요 기능](#주요-기능)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [설치 및 실행 방법](#설치-및-실행-방법)
5. [환경 변수 및 API 키 설정](#환경-변수-및-api-키-설정)
6. [파일별 상세 설명](#파일별-상세-설명)
7. [주요 변수 및 상태 관리](#주요-변수-및-상태-관리)
8. [API 함수 레퍼런스](#api-함수-레퍼런스)
9. [컴포넌트 Props 레퍼런스](#컴포넌트-props-레퍼런스)
10. [워크플로우](#워크플로우)

---

## 🎯 주요 기능

| 기능 | 설명 |
|------|------|
| **🔐 Google 로그인** | Firebase Authentication을 통한 Google 소셜 로그인 |
| **🎧 음악 검색** | Spotify API를 활용한 전체 음악 라이브러리 검색 |
| **📊 차트 보기** | 장르별 인기 음악 차트 표시 (K-Pop, Hip-Hop, R&B 등) |
| **💾 플레이리스트** | 좋아하는 곡을 저장하고 관리하는 개인 플레이리스트 |
| **📝 메모 기능** | 각 곡에 개인 메모를 작성하고 저장 |
| **🔍 필터/정렬** | 제목, 가수, 앨범, 인기도, 발매일 등으로 정렬 |

---

## 🛠 기술 스택

```
Frontend:       React 19.2.0
Routing:        React Router DOM 7.9.6
Backend/Auth:   Firebase (Authentication, Firestore)
API:            Spotify Web API
Build Tool:     Create React App (react-scripts 5.0.1)
```

---

## 📁 프로젝트 구조

```
spotify_api/
├── public/                    # 정적 파일
├── src/
│   ├── component/             # 재사용 가능한 UI 컴포넌트
│   │   ├── Banner.jsx         # 배너 컴포넌트
│   │   ├── Header.jsx         # 상단 네비게이션 헤더
│   │   ├── Hero.jsx           # 히어로 섹션 (메인 배너)
│   │   ├── SearchBar.jsx      # 검색 및 정렬 바
│   │   ├── SongModal.jsx      # 곡 상세정보 모달
│   │   └── TrackRow.jsx       # 트랙 리스트 아이템
│   │
│   ├── firebase.js            # Firebase 설정 및 초기화
│   ├── spotify.js             # Spotify API 함수들
│   │
│   ├── index.js               # 앱 진입점 (Entry Point)
│   ├── index.css              # 글로벌 스타일
│   │
│   ├── MainPage.js            # 메인 레이아웃 및 라우팅
│   ├── MainPage.css           # 메인 스타일시트
│   ├── HomePage.js            # 홈페이지 (메인 화면)
│   ├── ChartPage.js           # 차트 페이지
│   ├── SongList.js            # 노래 목록 페이지
│   ├── MyPlaylistPage.js      # 내 플레이리스트 페이지
│   ├── DeveloperPage.js       # 개발자 정보 페이지
│   ├── LoginPage.js           # 로그인 페이지
│   └── LoginPage.css          # 로그인 페이지 스타일
│
├── package.json               # 프로젝트 의존성
└── README.md                  # 프로젝트 문서 (현재 파일)
```

---

## 🚀 설치 및 실행 방법

### 1. 저장소 클론
```bash
git clone <repository-url>
cd spotify_api
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```
브라우저에서 `http://localhost:3000` 접속

### 4. 프로덕션 빌드
```bash
npm run build
```

---

## 🔑 환경 변수 및 API 키 설정

### Spotify API 설정 (`src/spotify.js`)
```javascript
const CLIENT_ID = 'your_spotify_client_id';        // Spotify 클라이언트 ID
const CLIENT_SECRET = 'your_spotify_client_secret'; // Spotify 클라이언트 시크릿
```

**Spotify 개발자 계정 생성 방법:**
1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 접속
2. 로그인 후 "Create App" 클릭
3. 앱 이름과 설명 입력
4. Client ID와 Client Secret 복사

### Firebase 설정 (`src/firebase.js`)
```javascript
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_project.firebaseapp.com",
    projectId: "your_project_id",
    storageBucket: "your_project.appspot.com",
    messagingSenderId: "your_sender_id",
    appId: "your_app_id"
};
```

**Firebase 프로젝트 설정 방법:**
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 새 프로젝트 생성
3. Authentication > Sign-in method에서 Google 활성화
4. Firestore Database 생성 (테스트 모드로 시작)
5. 프로젝트 설정에서 웹 앱 추가 후 설정값 복사

---

## 📄 파일별 상세 설명

### 📌 진입점 파일

#### `index.js` - 앱 진입점
```
역할: React 앱의 시작점. BrowserRouter로 라우팅을 감싸고 MainPage를 렌더링
```

### 📌 페이지 컴포넌트

#### `MainPage.js` - 메인 레이아웃
```
역할: 전체 앱의 레이아웃을 관리하고, 라우팅과 상태를 총괄
주요 상태: user, myPlaylist, memos, selectedTrack
주요 함수: addToPlaylist, removeFromPlaylist, handleSaveMemo
```

#### `HomePage.js` - 홈페이지
```
역할: 메인 화면 표시. 인기 차트, 트렌드 아티스트, 핫 키워드 표시
Spotify API: getMultiCharts() 사용
```

#### `ChartPage.js` - 차트 페이지
```
역할: 여러 장르의 음악 차트를 그리드 형태로 표시
Spotify API: getMultiCharts() 사용
```

#### `SongList.js` - 노래 목록
```
역할: 장르별 음악 탐색 및 전체 검색 기능
Spotify API: getTracksByGenre(), searchTracksGlobal() 사용
기능: 장르 필터, 검색, 정렬, 페이지네이션, 다중 선택
```

#### `MyPlaylistPage.js` - 내 플레이리스트
```
역할: 사용자가 저장한 플레이리스트 관리
기능: 검색, 정렬, 다중 선택 삭제
데이터: Firestore에서 로드
```

#### `LoginPage.js` - 로그인 페이지
```
역할: Google 소셜 로그인 UI
Firebase: signInWithPopup() 사용
```

#### `DeveloperPage.js` - 개발자 페이지
```
역할: 프로젝트 및 개발자 정보 표시
```

### 📌 재사용 컴포넌트

#### `Header.jsx` - 헤더
```
Props: user (현재 로그인한 사용자)
역할: 네비게이션 메뉴, 로그인/로그아웃 버튼
```

#### `Hero.jsx` - 히어로 섹션
```
Props: onSearchClick, title, cover1, cover2
역할: 페이지 상단의 대형 배너 영역
```

#### `SearchBar.jsx` - 검색바
```
Props: searchTerm, onSearchChange, sortType, onSortChange
역할: 검색 입력과 정렬 옵션 선택
```

#### `TrackRow.jsx` - 트랙 행
```
Props: track, rank, showAlbumInfo, onAdd, onRemove, onClick, 
       selectable, selected, onSelect, memo
역할: 트랙 정보를 한 줄로 표시
```

#### `SongModal.jsx` - 곡 모달
```
Props: track, onClose, user, memo, onSaveMemo, isSaved, onTogglePlaylist
역할: 곡의 상세 정보와 메모 편집 UI
```

#### `Banner.jsx` - 배너
```
역할: 플레이리스트로 이동하는 프로모션 배너
```

### 📌 유틸리티 파일

#### `spotify.js` - Spotify API
```
역할: Spotify Web API와 통신하는 모든 함수 정의
주요 함수: getToken, getMultiCharts, searchTracksGlobal, getTracksByGenre
```

#### `firebase.js` - Firebase 설정
```
역할: Firebase 앱 초기화 및 서비스 인스턴스 export
exports: auth, googleProvider, db
```

---

## 🔧 주요 변수 및 상태 관리

### MainPage.js 상태 변수

| 변수명 | 타입 | 설명 |
|--------|------|------|
| `user` | `Object \| null` | 현재 로그인한 Firebase 사용자 객체 |
| `myPlaylist` | `Array<Track>` | 사용자의 플레이리스트 (곡 배열) |
| `memos` | `Object` | 곡별 메모 저장 (`{ trackId: "메모 텍스트" }`) |
| `selectedTrack` | `Track \| null` | 현재 모달에 표시중인 트랙 |

### SongList.js 상태 변수

| 변수명 | 타입 | 설명 |
|--------|------|------|
| `tracks` | `Array<Track>` | 현재 표시할 트랙 목록 |
| `searchTerm` | `string` | 검색 입력값 |
| `sortType` | `string` | 정렬 기준 (예: "TITLE_ASC") |
| `selectedGenre` | `string` | 선택된 장르 (예: "K-Pop") |
| `selectedIds` | `Array<string>` | 체크된 트랙 ID 배열 |
| `currentPage` | `number` | 현재 페이지 번호 |
| `isLoading` | `boolean` | 로딩 상태 |
| `isSearchMode` | `boolean` | 검색 모드 여부 |

### Track 객체 구조

```javascript
{
    id: "spotify_track_id",      // Spotify 트랙 고유 ID
    rank: 1,                     // 순위 (표시용)
    title: "곡 제목",            // 곡 이름
    artist: "아티스트명",        // 아티스트 이름
    cover: "album_cover_url",    // 앨범 커버 이미지 URL
    album: "앨범명",             // 앨범 이름
    popularity: 85,              // 인기도 (0-100)
    releaseDate: "2024-01-01",   // 발매일
    duration: 210000             // 곡 길이 (밀리초)
}
```

---

## 📡 API 함수 레퍼런스

### spotify.js 함수

#### `getToken()`
```javascript
// Spotify API 접근 토큰 발급
// Returns: Promise<string> - 액세스 토큰
const token = await getToken();
```

#### `getMultiCharts()`
```javascript
// 여러 장르의 차트를 한번에 가져오기
// Returns: Promise<Array<{title: string, tracks: Track[]}>>
const charts = await getMultiCharts();
// 결과: [{ title: "🔥 지금 뜨는 K-Pop", tracks: [...] }, ...]
```

#### `searchTracksGlobal(query, limit, offset)`
```javascript
// Spotify 전체 라이브러리에서 검색
// Parameters:
//   query: string - 검색어
//   limit: number - 한번에 가져올 개수 (기본 50)
//   offset: number - 시작 위치 (기본 0)
// Returns: Promise<{items: Track[], total: number}>
const result = await searchTracksGlobal("BTS", 50, 0);
```

#### `getTracksByGenre(genreName)`
```javascript
// 특정 장르의 트랙 가져오기
// Parameters:
//   genreName: string - 장르명 ("K-Pop", "Hip-Hop" 등)
// Returns: Promise<Track[]>
const tracks = await getTracksByGenre("K-Pop");
```

#### `GENRE_CONFIG`
```javascript
// 장르별 설정 객체
// 구조: { '장르명': { artists: string[], emoji: string } }
const config = GENRE_CONFIG['K-Pop'];
// 결과: { artists: ['NewJeans', 'IVE', ...], emoji: '🎤' }
```

### 사용 가능한 장르 목록
| 장르 | 이모지 | 대표 아티스트 |
|------|--------|---------------|
| K-Pop | 🎤 | NewJeans, IVE, aespa, BLACKPINK, BTS |
| Hip-Hop | 🎧 | Drake, Kendrick Lamar, Travis Scott |
| R&B | 🎷 | The Weeknd, SZA, Daniel Caesar |
| 발라드 | 🎹 | 아이유, 태연, 백예린, 헤이즈 |
| 인디/록 | 🎸 | 잔나비, 혁오, Wave to Earth |
| EDM | 🎛️ | Calvin Harris, Martin Garrix |
| OST | 🎬 | 청하, 에일리, 거미, 다비치 |

---

## 🧩 컴포넌트 Props 레퍼런스

### Header
```jsx
<Header user={user} />
```
| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user` | `Object \| null` | ✅ | Firebase 사용자 객체 |

### Hero
```jsx
<Hero 
    onSearchClick={() => {}}
    title="제목"
    cover1="이미지URL"
    cover2="이미지URL"
/>
```
| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `onSearchClick` | `function` | ✅ | 검색 버튼 클릭 핸들러 |
| `title` | `string` | ❌ | 히어로 섹션 제목 |
| `cover1` | `string` | ❌ | 1위 앨범 커버 이미지 URL |
| `cover2` | `string` | ❌ | 2위 앨범 커버 이미지 URL |

### SearchBar
```jsx
<SearchBar 
    searchTerm=""
    onSearchChange={(e) => {}}
    sortType="RANK"
    onSortChange={(e) => {}}
/>
```
| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `searchTerm` | `string` | ✅ | 현재 검색어 |
| `onSearchChange` | `function` | ✅ | 검색어 변경 핸들러 |
| `sortType` | `string` | ✅ | 현재 정렬 타입 |
| `onSortChange` | `function` | ✅ | 정렬 타입 변경 핸들러 |

### TrackRow
```jsx
<TrackRow 
    track={trackObject}
    rank={1}
    showAlbumInfo={true}
    onAdd={() => {}}
    onRemove={() => {}}
    onClick={() => {}}
    selectable={true}
    selected={false}
    onSelect={(id) => {}}
    memo="메모 내용"
/>
```
| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `track` | `Track` | ✅ | 트랙 객체 |
| `rank` | `number` | ✅ | 표시할 순위 |
| `showAlbumInfo` | `boolean` | ❌ | 앨범 정보 표시 여부 |
| `onAdd` | `function` | ❌ | 추가 버튼 핸들러 |
| `onRemove` | `function` | ❌ | 삭제 버튼 핸들러 |
| `onClick` | `function` | ❌ | 행 클릭 핸들러 |
| `selectable` | `boolean` | ❌ | 체크박스 표시 여부 |
| `selected` | `boolean` | ❌ | 체크박스 선택 상태 |
| `onSelect` | `function` | ❌ | 체크박스 변경 핸들러 |
| `memo` | `string` | ❌ | 표시할 메모 |

### SongModal
```jsx
<SongModal 
    track={trackObject}
    onClose={() => {}}
    user={userObject}
    memo="메모 내용"
    onSaveMemo={(id, text) => {}}
    isSaved={true}
    onTogglePlaylist={() => {}}
/>
```
| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `track` | `Track` | ✅ | 트랙 객체 |
| `onClose` | `function` | ✅ | 모달 닫기 핸들러 |
| `user` | `Object \| null` | ✅ | Firebase 사용자 객체 |
| `memo` | `string` | ❌ | 현재 저장된 메모 |
| `onSaveMemo` | `function` | ❌ | 메모 저장 핸들러 `(trackId, text)` |
| `isSaved` | `boolean` | ✅ | 플레이리스트 저장 여부 |
| `onTogglePlaylist` | `function` | ✅ | 플레이리스트 토글 핸들러 |

---

## 🔄 워크플로우

### 1. 사용자 인증 플로우

```
[LoginPage] ─── Google 로그인 버튼 클릭
     │
     ▼
[Firebase] ─── signInWithPopup(auth, googleProvider)
     │
     ▼
[Firebase] ─── onAuthStateChanged 감지
     │
     ▼
[MainPage] ─── user 상태 업데이트
     │
     ▼
[Firestore] ─── users/{uid} 문서에서 playlist, memos 로드
```

### 2. 음악 검색 플로우

```
[SongList] ─── 사용자가 검색어 입력
     │
     ▼
[spotify.js] ─── searchTracksGlobal(searchTerm)
     │
     ▼
[Spotify API] ─── /v1/search?q=검색어&type=track
     │
     ▼
[SongList] ─── tracks 상태 업데이트 및 화면 렌더링
```

### 3. 플레이리스트 추가 플로우

```
[TrackRow/SongModal] ─── "+" 또는 "Add to Playlist" 클릭
     │
     ▼
[MainPage] ─── addToPlaylist(track) 호출
     │
     ├── 중복 체크 (myPlaylist에 이미 존재?)
     │
     ▼
[Firestore] ─── updateDoc(userDocRef, { playlist: arrayUnion(track) })
     │
     ▼
[MainPage] ─── myPlaylist 상태 업데이트
```

### 4. 메모 저장 플로우

```
[SongModal] ─── 메모 작성 후 "Save" 클릭
     │
     ▼
[MainPage] ─── handleSaveMemo(trackId, text)
     │
     ▼
[Firestore] ─── updateDoc(userDocRef, { [`memos.${trackId}`]: text })
     │
     ▼
[MainPage] ─── memos 상태 업데이트
```

### 5. 라우팅 구조

```
/              → HomePage      (홈 화면)
/charts        → ChartPage     (차트 페이지)
/songs         → SongList      (노래 목록)
/playlist      → MyPlaylistPage (내 플레이리스트)
/login         → LoginPage     (로그인)
/developers    → DeveloperPage (개발자 정보)
```

---

## 🔧 정렬 옵션 코드

| 코드 | 설명 |
|------|------|
| `RANK` | 기본 (랭킹순) |
| `TITLE_ASC` | 제목 가나다순 |
| `TITLE_DESC` | 제목 역순 |
| `ARTIST_ASC` | 가수 가나다순 |
| `ARTIST_DESC` | 가수 역순 |
| `ALBUM_ASC` | 앨범 가나다순 |
| `POPULARITY_DESC` | 인기도 높은순 |
| `DATE_NEW` | 발매일 최신순 |
| `DATE_OLD` | 발매일 오래된순 |
| `ADDED` | 추가된 순서 (플레이리스트 전용) |

---

## 📜 라이선스

This project is for educational purposes (OSS Project - Team 06).

---

## 🙏 감사의 말

- **Spotify** - 음악 데이터 API 제공
- **Firebase** - 인증 및 데이터베이스 서비스
- **React Team** - 프레임워크 제공
