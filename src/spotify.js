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

//랜덤한 k-pop 노래를 10개 선정해서 가져오려고 여러번 시도했지만, sorting이 이상한지 뭔지 실패함.
//그래서 유명한 아티스트 목록을 뽑아서 이 아티스트들을 기반으로 노래를 가져오기로 했음.

// K-Pop 아티스트 목록
const KPOP_ARTISTS = ['NewJeans', 'IVE', 'aespa', 'BLACKPINK', 'BTS', 'TWICE', 'Stray Kids', 'SEVENTEEN', 'LE SSERAFIM', '(G)I-DLE'];

// Hip-Hop 아티스트 목록
const HIPHOP_ARTISTS = ['Drake', 'Kendrick Lamar', 'Travis Scott', 'J. Cole', 'Post Malone', '21 Savage', 'Lil Baby', 'Future', 'Metro Boomin', 'Tyler, The Creator'];

// 아티스트 기반으로 트랙 검색
const searchByArtists = async (artists) => {
    try {
        // 토큰 발급
        const token = await getToken();

        // 토큰이 없으면 빈 배열 반환
        if (!token) return [];

        //저장할 배열
        let allTracks = [];

        // 랜덤하게 3명의 아티스트 선택
        //sort(() => 0.5 - Math.random())은 랜덤하게 정렬
        //상위 3명뽑아옴
        const shuffledArtists = artists.sort(() => 0.5 - Math.random()).slice(0, 3);


        //foreach랑 비슷한 문법
        for (const artist of shuffledArtists) {
            //artist를 기반으로 노래를 가져옴 
            const res = await fetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=10`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            });

            //응답을 json으로 변환
            const data = await res.json();

            //응답 데이터에서 트랙 정보 추출
            if (data.tracks && data.tracks.items) {
                allTracks.push(...data.tracks.items);
            }
        }

        if (allTracks.length === 0) return [];

        // 랜덤 셔플 후 10개 선택
        const shuffled = allTracks.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        // 트랙 정보, 나중에 전부 사용 가능!
        return selected.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            title: track.name,
            artist: track.artists[0].name,
            cover: track.album.images[0]?.url || ''
        }));

    } catch (error) {
        console.error('Search error:', error);
        return [];
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
