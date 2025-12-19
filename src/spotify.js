// Spotify API 설정
// Spotify 개발자 계정에서 생성한 Client ID와 Client Secret.
// 이게 없으면 API 호출이 안됨.
const CLIENT_ID = 'd302c0b71bea4002b07a5d5cf11cb67c';
const CLIENT_SECRET = '7953d97b40524b70a57d1a6f64972c6a';

// 토큰 발급 받기
// 토큰은 일정 시간이 지나면 만료되므로, 매번 호출할 때마다 토큰을 새로 발급받아야 함.
const getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        //Post 요청으로 토큰을 받아옴.
        //Post인 이유는 토큰을 받아오기 위해서는 토큰을 보내야 함.
        method: 'POST',
        headers: {
            //content-type은 토큰을 보내기 위한 형식.
            'Content-Type': 'application/x-www-form-urlencoded',
            //Authorization은 토큰을 보내기 위한 인증.
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    // 토큰 데이터를 JSON으로 변환
    const data = await result.json();

    // 토큰 반환
    return data.access_token;
}

// K-Pop 아티스트 목록
const KPOP_ARTISTS = ['NewJeans', 'IVE', 'aespa', 'BLACKPINK', 'BTS', 'TWICE', 'Stray Kids', 'SEVENTEEN', 'LE SSERAFIM', '(G)I-DLE'];

// Hip-Hop 아티스트 목록
const HIPHOP_ARTISTS = ['Drake', 'Kendrick Lamar', 'Travis Scott', 'J. Cole', 'Post Malone', '21 Savage', 'Lil Baby', 'Future', 'Metro Boomin', 'Tyler, The Creator'];

// R&B 아티스트 목록
const RNB_ARTISTS = ['The Weeknd', 'SZA', 'Daniel Caesar', 'Brent Faiyaz', 'Frank Ocean', 'Doja Cat', 'Summer Walker', 'Kehlani', 'H.E.R.', 'Jhené Aiko'];

// 발라드 아티스트 목록 (한국)
const BALLAD_ARTISTS = ['아이유', '태연', '백예린', '헤이즈', '폴킴', '성시경', '박효신', '케이시', '임한별', '멜로망스'];

// 인디/록 아티스트 목록
const INDIE_ARTISTS = ['잔나비', '혁오', 'The Black Skirts', '새소년', '실리카겔', 'Wave to Earth', 'OOHYO', '검정치마', 'So!YoON!', 'ADOY'];

// EDM/댄스 아티스트 목록
const EDM_ARTISTS = ['Calvin Harris', 'Martin Garrix', 'Marshmello', 'Kygo', 'David Guetta', 'Avicii', 'Zedd', 'Tiësto', 'The Chainsmokers', 'Illenium'];

// OST 아티스트 목록
const OST_ARTISTS = ['청하', '에일리', '거미', '다비치', '벤', '볼빨간사춘기', '10cm', '크러쉬', '정승환', '백현'];

// 모든 장르 데이터 export
export const GENRE_CONFIG = {
    'K-Pop': { artists: KPOP_ARTISTS, emoji: '🎤' },
    'Hip-Hop': { artists: HIPHOP_ARTISTS, emoji: '🎧' },
    'R&B': { artists: RNB_ARTISTS, emoji: '🎷' },
    '발라드': { artists: BALLAD_ARTISTS, emoji: '🎹' },
    '인디/록': { artists: INDIE_ARTISTS, emoji: '🎸' },
    'EDM': { artists: EDM_ARTISTS, emoji: '🎛️' },
    'OST': { artists: OST_ARTISTS, emoji: '🎬' }
};


// 아티스트 기반으로 트랙 검색
const searchByArtists = async (artists) => {
    try {
        // 토큰 발급
        const token = await getToken();

        // 토큰이 없으면 빈 배열 반환
        if (!token) return [];

        //저장할 배열
        let allTracks = [];

        // 모든 아티스트에 대해 노래를 가져오도록 제약 해제
        const targetArtists = artists;

        // 각 아티스트별로 여러 페이지를 가져와서 양을 대폭 늘림
        const fetchPromises = targetArtists.map(async (artist) => {
            let artistTracks = [];
            // 한 번에 50개씩, 총 2페이지(100곡)씩 가져옴
            for (let offset of [0, 50]) {
                try {
                    const res = await fetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50&offset=${offset}`, {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    const data = await res.json();
                    if (data.tracks && data.tracks.items) {
                        artistTracks.push(...data.tracks.items);
                    }
                } catch (e) {
                    console.error(`Error fetching for ${artist}:`, e);
                }
            }
            return artistTracks;
        });

        const results = await Promise.all(fetchPromises);
        allTracks = results.flat();

        if (allTracks.length === 0) return [];

        // 중복 제거 (다른 검색 경로로 같은 곡이 올 수 있음)
        const uniqueTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());

        // 랜덤 셔플로 다양성 유지
        const selected = uniqueTracks.sort(() => 0.5 - Math.random());

        // 트랙 정보 매핑
        return selected.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            title: track.name,
            artist: track.artists[0].name,
            cover: track.album.images[0]?.url || '',
            album: track.album.name,
            popularity: track.popularity,
            releaseDate: track.album.release_date,
            duration: track.duration_ms
        }));

    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// 차트 페이지용 테마 (아티스트 기반으로 정확한 장르 보장)
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

// 배열을 랜덤으로 섞는 유틸리티 함수
const shuffleArray = (array) => {
    return array.sort(() => 0.5 - Math.random());
};

// 메인 기능: 랜덤으로 6개 테마를 선정해 Top 10 가져오기 (아티스트 기반)
export const getMultiCharts = async () => {
    try {
        const token = await getToken();
        if (!token) return [];

        // 1. 전체 테마 중 랜덤으로 6개 선택
        const selectedThemes = shuffleArray([...CHART_THEMES]).slice(0, 6);

        // 2. 6개 테마에 대해 병렬로 아티스트 기반 검색
        const promises = selectedThemes.map(async (theme) => {
            let allTracks = [];

            // 각 테마의 아티스트들에서 곡 가져오기
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

            // 데이터 가공
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

            return {
                title: theme.title,
                tracks: tracks
            };
        });

        // 모든 요청이 끝날 때까지 대기
        const charts = await Promise.all(promises);
        return charts;

    } catch (error) {
        console.error("Error fetching charts:", error);
        return [];
    }
};

// 전체 스포티파이 라이브러리에서 검색 (제약 없음)
export const searchTracksGlobal = async (query, limit = 50, offset = 0) => {
    try {
        const token = await getToken();
        if (!token) return { items: [], total: 0 };

        // q=genre:"k-pop" 을 앞에 배치하고 market=KR을 추가하여 한국 음악 중심 검색 강제
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&offset=${offset}&market=KR`;

        const res = await fetch(searchUrl, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await res.json();
        if (!data.tracks) return { items: [], total: 0 };

        const mappedTracks = data.tracks.items.map((track, index) => ({
            id: track.id,
            rank: offset + index + 1,
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
            total: data.tracks.total
        };

    } catch (error) {
        console.error('Global Search Error:', error);
        return { items: [], total: 0 };
    }
}

// K-Pop 트랙 가져오기
export const getRandomKpopTracks = async () => {
    return await searchByArtists(KPOP_ARTISTS);
}

// Rap 트랙 가져오기
export const getRandomRapSongTracks = async () => {
    return await searchByArtists(HIPHOP_ARTISTS);
}

// 장르별 트랙 가져오기 (범용)
export const getTracksByGenre = async (genreName) => {
    const config = GENRE_CONFIG[genreName];
    if (!config) return [];
    return await searchByArtists(config.artists);
}