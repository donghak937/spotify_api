// Spotify API 설정
const CLIENT_ID = 'd302c0b71bea4002b07a5d5cf11cb67c'; // Spotify Developer Dashboard에서 발급받은 ID
const CLIENT_SECRET = '7953d97b40524b70a57d1a6f64972c6a'; // Spotify Developer Dashboard에서 발급받은 Secret

// 토큰 발급 받기 (Client Credentials Flow)
const getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

// K-Pop 트랙 랜덤으로 가져오기
export const getRandomKpopTracks = async () => {
    try {
        const token = await getToken();

        // 매번 다른 노래가 나오도록 0~500 사이의 랜덤한 시작점을 설정
        const randomOffset = Math.floor(Math.random() * 500);

        // genre:k-pop 으로 검색
        const result = await fetch(`https://api.spotify.com/v1/search?q=genre:k-pop&type=track&limit=10&offset=${randomOffset}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();

        return data.tracks.items.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            title: track.name,
            artist: track.artists[0].name,
            cover: track.album.images[0].url
        }));

    } catch (error) {
        console.error("Spotify API Error:", error);
        return [];
    }
}



// 랩 트랙 랜덤으로 가져오기
export const getRandomRapSongTracks = async () => {
    try {
        const token = await getToken();

        // 매번 다른 노래가 나오도록 0~500 사이의 랜덤한 시작점을 설정
        const randomOffset = Math.floor(Math.random() * 500);

        // genre:k-pop 으로 검색
        const result = await fetch(`https://api.spotify.com/v1/search?q=genre:hip-hop&type=track&limit=10&offset=${randomOffset}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();

        return data.tracks.items.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            title: track.name,
            artist: track.artists[0].name,
            cover: track.album.images[0].url
        }));

    } catch (error) {
        console.error("Spotify API Error:", error);
        return [];
    }
}
