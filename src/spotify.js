/**
 * @file spotify.js
 * @description Spotify Web API와 통신하는 모든 함수들을 정의한 파일
 * 
 * 이 파일에서는 다음 기능들을 제공합니다:
 * - Spotify API 토큰 발급
 * - 아티스트 기반 트랙 검색
 * - 장르별 차트 데이터 가져오기
 * - 전체 라이브러리 검색
 * 
 * Spotify API 문서: https://developer.spotify.com/documentation/web-api
 */

// ============================================================
// ======================== API 설정 ==========================
// ============================================================

/**
 * Spotify API 인증 정보
 * 
 * ⚠️ 주의: 실제 프로덕션에서는 환경 변수로 관리해야 합니다!
 * 
 * API 키 얻는 방법:
 * 1. Spotify Developer Dashboard (https://developer.spotify.com/dashboard) 접속
 * 2. 로그인 후 "Create App" 클릭
 * 3. App name, App description 입력
 * 4. Redirect URI에 http://localhost:3000 추가
 * 5. Web API 체크 후 생성
 * 6. 생성된 앱에서 Client ID와 Client Secret 확인
 */
const CLIENT_ID = 'd302c0b71bea4002b07a5d5cf11cb67c';      // Spotify 클라이언트 ID
const CLIENT_SECRET = '7953d97b40524b70a57d1a6f64972c6a';  // Spotify 클라이언트 시크릿

// ============================================================
// ====================== 토큰 발급 함수 =======================
// ============================================================

/**
 * Spotify API 접근 토큰 발급
 * 
 * Client Credentials Flow를 사용하여 토큰을 발급받습니다.
 * 이 방식은 사용자 데이터에 접근하지 않는 공개 데이터 조회에 사용됩니다.
 * 
 * @async
 * @returns {Promise<string>} - Spotify API 접근 토큰
 * 
 * @example
 * const token = await getToken();
 * // token: "BQB7f3P9a3k1X..."
 */
const getToken = async () => {
    // Spotify 토큰 엔드포인트에 POST 요청
    const result = await fetch('https://accounts.spotify.com/api/token', {
        // POST 방식으로 요청 (토큰 발급은 항상 POST)
        method: 'POST',
        headers: {
            // 요청 본문 형식 지정
            'Content-Type': 'application/x-www-form-urlencoded',

            // Basic 인증: Client ID와 Secret을 Base64 인코딩
            // btoa()는 문자열을 Base64로 인코딩하는 브라우저 내장 함수
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        // grant_type을 client_credentials로 설정
        // 이는 서버-to-서버 인증 방식을 의미
        body: 'grant_type=client_credentials'
    });

    // 응답을 JSON으로 파싱
    const data = await result.json();

    // access_token 필드만 반환
    // 토큰은 보통 1시간 동안 유효
    return data.access_token;
}

// ============================================================
// ===================== 장르별 아티스트 목록 ==================
// ============================================================

/**
 * K-Pop 대표 아티스트 목록
 * 검색 쿼리에 사용되어 해당 장르의 트랙을 가져옵니다.
 */
const KPOP_ARTISTS = ['NewJeans', 'IVE', 'aespa', 'BLACKPINK', 'BTS', 'TWICE', 'Stray Kids', 'SEVENTEEN', 'LE SSERAFIM', '(G)I-DLE'];

/**
 * Hip-Hop 대표 아티스트 목록
 */
const HIPHOP_ARTISTS = ['Drake', 'Kendrick Lamar', 'Travis Scott', 'J. Cole', 'Post Malone', '21 Savage', 'Lil Baby', 'Future', 'Metro Boomin', 'Tyler, The Creator'];

/**
 * R&B 대표 아티스트 목록
 */
const RNB_ARTISTS = ['The Weeknd', 'SZA', 'Daniel Caesar', 'Brent Faiyaz', 'Frank Ocean', 'Doja Cat', 'Summer Walker', 'Kehlani', 'H.E.R.', 'Jhené Aiko'];

/**
 * 발라드 대표 아티스트 목록 (한국)
 */
const BALLAD_ARTISTS = ['아이유', '태연', '백예린', '헤이즈', '폴킴', '성시경', '박효신', '케이시', '임한별', '멜로망스'];

/**
 * 인디/록 대표 아티스트 목록
 */
const INDIE_ARTISTS = ['잔나비', '혁오', 'The Black Skirts', '새소년', '실리카겔', 'Wave to Earth', 'OOHYO', '검정치마', 'So!YoON!', 'ADOY'];

/**
 * EDM/댄스 대표 아티스트 목록
 */
const EDM_ARTISTS = ['Calvin Harris', 'Martin Garrix', 'Marshmello', 'Kygo', 'David Guetta', 'Avicii', 'Zedd', 'Tiësto', 'The Chainsmokers', 'Illenium'];

/**
 * OST 아티스트 목록
 */
const OST_ARTISTS = ['청하', '에일리', '거미', '다비치', '벤', '볼빨간사춘기', '10cm', '크러쉬', '정승환', '백현'];

// ============================================================
// ==================== 장르 설정 객체 =========================
// ============================================================

/**
 * 장르별 설정 정보
 * 
 * 각 장르에 대한 아티스트 목록과 이모지를 매핑합니다.
 * SongList.js 등에서 import하여 사용합니다.
 * 
 * @type {Object.<string, {artists: string[], emoji: string}>}
 * 
 * @example
 * const config = GENRE_CONFIG['K-Pop'];
 * console.log(config.emoji);    // '🎤'
 * console.log(config.artists);  // ['NewJeans', 'IVE', ...]
 */
export const GENRE_CONFIG = {
    'K-Pop': { artists: KPOP_ARTISTS, emoji: '🎤' },
    'Hip-Hop': { artists: HIPHOP_ARTISTS, emoji: '🎧' },
    'R&B': { artists: RNB_ARTISTS, emoji: '🎷' },
    '발라드': { artists: BALLAD_ARTISTS, emoji: '🎹' },
    '인디/록': { artists: INDIE_ARTISTS, emoji: '🎸' },
    'EDM': { artists: EDM_ARTISTS, emoji: '🎛️' },
    'OST': { artists: OST_ARTISTS, emoji: '🎬' }
};

// ============================================================
// =================== 아티스트 기반 검색 함수 =================
// ============================================================

/**
 * 아티스트 목록으로 트랙 검색
 * 
 * 주어진 아티스트 배열의 각 아티스트에 대해 Spotify API를 호출하여
 * 트랙들을 가져온 후 병합합니다.
 * 
 * @async
 * @param {string[]} artists - 검색할 아티스트 이름 배열
 * @returns {Promise<Track[]>} - 트랙 객체 배열
 * 
 * @example
 * const tracks = await searchByArtists(['BTS', 'NewJeans']);
 */
const searchByArtists = async (artists) => {
    try {
        // 1. API 토큰 발급
        const token = await getToken();

        // 토큰이 없으면 빈 배열 반환
        if (!token) return [];

        // 모든 트랙을 저장할 배열
        let allTracks = [];

        // 검색할 아티스트 목록 (전체 사용)
        const targetArtists = artists;

        /**
         * 각 아티스트별로 병렬 API 호출
         * 
         * Promise.all을 사용하여 모든 아티스트에 대한 요청을 동시에 처리
         * 한 아티스트당 2페이지(100곡)씩 가져옴
         */
        const fetchPromises = targetArtists.map(async (artist) => {
            let artistTracks = [];

            // 페이지네이션: offset 0과 50으로 총 100곡 가져오기
            for (let offset of [0, 50]) {
                try {
                    // Spotify Search API 호출
                    // q=artist:아티스트명 형식으로 아티스트 검색
                    const res = await fetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50&offset=${offset}`, {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    const data = await res.json();

                    // 결과가 있으면 배열에 추가
                    if (data.tracks && data.tracks.items) {
                        artistTracks.push(...data.tracks.items);
                    }
                } catch (e) {
                    console.error(`Error fetching for ${artist}:`, e);
                }
            }
            return artistTracks;
        });

        // 모든 Promise 완료 대기 후 결과 병합
        const results = await Promise.all(fetchPromises);
        allTracks = results.flat();  // 2D 배열을 1D로 평탄화

        // 결과가 없으면 빈 배열 반환
        if (allTracks.length === 0) return [];

        /**
         * 중복 트랙 제거
         * 
         * 같은 곡이 여러 아티스트 검색에서 나올 수 있으므로
         * track.id를 키로 사용하여 중복 제거
         */
        const uniqueTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());

        /**
         * 랜덤 셔플
         * 
         * 항상 같은 순서가 아닌 다양한 결과를 제공하기 위해
         * 배열을 무작위로 섞음
         */
        const selected = uniqueTracks.sort(() => 0.5 - Math.random());

        /**
         * 트랙 데이터 매핑
         * 
         * Spotify API 응답 형식을 앱에서 사용하는 Track 객체 형식으로 변환
         */
        return selected.map((track, index) => ({
            id: track.id,                                    // Spotify 트랙 고유 ID
            rank: index + 1,                                 // 표시 순위
            title: track.name,                               // 곡 제목
            artist: track.artists[0].name,                   // 첫 번째 아티스트 이름
            cover: track.album.images[0]?.url || '',         // 앨범 커버 이미지 URL
            album: track.album.name,                         // 앨범 이름
            popularity: track.popularity,                    // 인기도 (0-100)
            releaseDate: track.album.release_date,           // 발매일 (YYYY-MM-DD)
            duration: track.duration_ms                      // 곡 길이 (밀리초)
        }));

    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// ============================================================
// ====================== 차트 테마 설정 =======================
// ============================================================

/**
 * 차트 페이지용 테마 정의
 * 
 * 각 테마는 제목과 해당 테마의 대표 아티스트 목록을 포함합니다.
 * getMultiCharts()에서 랜덤으로 선택됩니다.
 */
const CHART_THEMES = [
    { title: "🔥 지금 뜨는 K-Pop", artists: ['NewJeans', 'IVE', 'aespa', 'LE SSERAFIM', '(G)I-DLE'] },
    { title: "😎 힙한 K-HipHop", artists: ['Zico', 'pH-1', 'Jay Park', 'GRAY', 'Crush'] },
    { title: "😭 새벽 감성 발라드", artists: ['아이유', '태연', '백예린', '헤이즈', '폴킴'] },
    { title: "🍷 트렌디한 R&B", artists: ['The Weeknd', 'SZA', 'Daniel Caesar', 'Brent Faiyaz', 'Doja Cat'] },
    { title: "🎸 방구석 인디 음악", artists: ['잔나비', '혁오', 'Wave to Earth', '새소년', 'OOHYO'] },
    { title: "🎛️ 신나는 EDM", artists: ['Calvin Harris', 'Martin Garrix', 'Marshmello', 'Kygo', 'Zedd'] },
    { title: "🎬 드라마 OST 명곡", artists: ['청하', '에일리', '거미', '다비치', '10cm'] },
    { title: "🌍 글로벌 팝 히트", artists: ['Taylor Swift', 'Ed Sheeran', 'Bruno Mars', 'Dua Lipa', 'Charlie Puth'] }
];

// ============================================================
// ====================== 유틸리티 함수 ========================
// ============================================================

/**
 * 배열을 무작위로 섞는 함수
 * 
 * Fisher-Yates 알고리즘의 간소화된 버전을 사용
 * 
 * @param {Array} array - 섞을 배열
 * @returns {Array} - 섞인 배열 (원본 배열을 변경)
 */
const shuffleArray = (array) => {
    return array.sort(() => 0.5 - Math.random());
};

// ============================================================
// ==================== 멀티 차트 가져오기 =====================
// ============================================================

/**
 * 여러 장르의 차트를 한번에 가져오기
 * 
 * CHART_THEMES에서 랜덤으로 6개를 선택하여 각 테마의 아티스트 기반으로
 * 트랙을 검색하고 차트 데이터를 반환합니다.
 * 
 * @async
 * @returns {Promise<Array<{title: string, tracks: Track[]}>>} - 차트 배열
 * 
 * @example
 * const charts = await getMultiCharts();
 * // charts: [
 * //   { title: "🔥 지금 뜨는 K-Pop", tracks: [...] },
 * //   { title: "😎 힙한 K-HipHop", tracks: [...] },
 * //   ...
 * // ]
 */
export const getMultiCharts = async () => {
    try {
        // 토큰 발급
        const token = await getToken();
        if (!token) return [];

        // 전체 테마 중 랜덤으로 6개 선택
        const selectedThemes = shuffleArray([...CHART_THEMES]).slice(0, 6);

        /**
         * 6개 테마에 대해 병렬로 API 호출
         * 
         * 각 테마의 아티스트들에 대해 트랙을 가져와 Top 10 구성
         */
        const promises = selectedThemes.map(async (theme) => {
            let allTracks = [];

            // 각 아티스트별로 5곡씩 가져오기
            for (const artist of theme.artists) {
                const res = await fetch(
                    `https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=5&market=KR`,
                    { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }
                );
                const data = await res.json();

                if (data.tracks && data.tracks.items) {
                    allTracks.push(...data.tracks.items);
                }
            }

            // 중복 제거 및 랜덤 셔플 후 10개 선택
            const uniqueTracks = Array.from(new Map(allTracks.map(t => [t.id, t])).values());
            const selected = shuffleArray(uniqueTracks).slice(0, 10);

            // Track 객체 형식으로 변환
            const tracks = selected.map((track, index) => ({
                id: track.id,
                rank: index + 1,
                title: track.name,
                artist: track.artists[0].name,
                cover: track.album.images[0]?.url || '',
                album: track.album.name,
                popularity: track.popularity,
                releaseDate: track.album.release_date
            }));

            // 테마 제목과 트랙 목록 반환
            return {
                title: theme.title,
                tracks: tracks
            };
        });

        // 모든 차트 데이터 수집 완료 대기
        const charts = await Promise.all(promises);
        return charts;

    } catch (error) {
        console.error("Error fetching charts:", error);
        return [];
    }
};

// ============================================================
// ================== 전체 라이브러리 검색 =====================
// ============================================================

/**
 * Spotify 전체 라이브러리에서 검색
 * 
 * 장르 제한 없이 모든 Spotify 곡을 검색합니다.
 * SongList.js의 검색 기능에서 사용됩니다.
 * 
 * @async
 * @param {string} query - 검색어 (곡 제목, 아티스트 등)
 * @param {number} [limit=50] - 한 번에 가져올 트랙 수 (최대 50)
 * @param {number} [offset=0] - 시작 위치 (페이지네이션용)
 * @returns {Promise<{items: Track[], total: number}>} - 검색 결과
 * 
 * @example
 * // 첫 번째 페이지 (1~50번)
 * const result1 = await searchTracksGlobal("BTS", 50, 0);
 * 
 * // 두 번째 페이지 (51~100번)
 * const result2 = await searchTracksGlobal("BTS", 50, 50);
 */
export const searchTracksGlobal = async (query, limit = 50, offset = 0) => {
    try {
        // 토큰 발급
        const token = await getToken();
        if (!token) return { items: [], total: 0 };

        /**
         * Spotify Search API 호출
         * 
         * 파라미터:
         * - q: 검색어
         * - type: 검색 대상 (track, album, artist 등)
         * - limit: 결과 개수
         * - offset: 시작 위치
         * - market: 서비스 지역 (KR = 한국)
         */
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&offset=${offset}&market=KR`;

        const res = await fetch(searchUrl, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await res.json();

        // 결과가 없으면 빈 결과 반환
        if (!data.tracks) return { items: [], total: 0 };

        // Track 객체 형식으로 변환
        const mappedTracks = data.tracks.items.map((track, index) => ({
            id: track.id,
            rank: offset + index + 1,                        // offset 기준으로 순위 계산
            title: track.name,
            artist: track.artists[0].name,
            cover: track.album.images[0]?.url || '',
            album: track.album.name,
            popularity: track.popularity,
            releaseDate: track.album.release_date,
            duration: track.duration_ms
        }));

        return {
            items: mappedTracks,
            total: data.tracks.total                         // 전체 검색 결과 수
        };

    } catch (error) {
        console.error('Global Search Error:', error);
        return { items: [], total: 0 };
    }
}

// ============================================================
// =================== 레거시 호환 함수들 ======================
// ============================================================

/**
 * K-Pop 트랙 가져오기 (레거시 호환)
 * 
 * @async
 * @returns {Promise<Track[]>} - K-Pop 트랙 배열
 */
export const getRandomKpopTracks = async () => {
    return await searchByArtists(KPOP_ARTISTS);
}

/**
 * Hip-Hop 트랙 가져오기 (레거시 호환)
 * 
 * @async
 * @returns {Promise<Track[]>} - Hip-Hop 트랙 배열
 */
export const getRandomRapSongTracks = async () => {
    return await searchByArtists(HIPHOP_ARTISTS);
}

// ============================================================
// =================== 장르별 트랙 가져오기 ====================
// ============================================================

/**
 * 특정 장르의 트랙 가져오기
 * 
 * GENRE_CONFIG에 정의된 장르의 아티스트 목록을 사용하여
 * 해당 장르의 트랙들을 검색합니다.
 * 
 * @async
 * @param {string} genreName - 장르 이름 (예: "K-Pop", "Hip-Hop", "발라드")
 * @returns {Promise<Track[]>} - 해당 장르의 트랙 배열
 * 
 * @example
 * const kpopTracks = await getTracksByGenre("K-Pop");
 * const balladTracks = await getTracksByGenre("발라드");
 */
export const getTracksByGenre = async (genreName) => {
    // GENRE_CONFIG에서 해당 장르 설정 가져오기
    const config = GENRE_CONFIG[genreName];

    // 정의되지 않은 장르면 빈 배열 반환
    if (!config) return [];

    // 해당 장르의 아티스트 목록으로 검색
    return await searchByArtists(config.artists);
}