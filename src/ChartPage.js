import React, { useEffect, useState } from "react";
import './MainPage.css';
import { getRandomKpopTracks, getRandomRapSongTracks } from './spotify';
import { useNavigate } from 'react-router-dom';
import Hero from './component/Hero';
import TrackRow from './component/TrackRow';

function ChartPage({ onTrackClick }) {
    const [tracks, setTracks] = useState([]);
    const [rapTracks, setRapTracks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const kpopTracks = await getRandomKpopTracks();
            if (kpopTracks && kpopTracks.length > 0) {
                setTracks(kpopTracks);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const rapTracks = await getRandomRapSongTracks();
            if (rapTracks && rapTracks.length > 0) {
                setRapTracks(rapTracks);
            }
        };
        fetchData();
    }, []);

    const handleSearchClick = () => {
        navigate('/songs');
    };

    return (
        <>
            <Hero onSearchClick={handleSearchClick} />

            <section className="main-body">
                {/* K-pop Chart */}
                <div className="main-chart">
                    <h2 className="main-section-title">K-pop Chart</h2>

                    <div className="main-video-card">
                        <div className="main-video-thumb">K-pop</div>
                        <div className="main-video-info">
                            <div className="main-video-title">무작위 K-pop 트랙</div>
                            <p className="main-video-desc">
                                무작위 K-pop 트랙을 소개해드려요!
                            </p>
                        </div>
                    </div>

                    <ul className="main-chart-list">
                        {tracks.map((track) => (
                            <TrackRow key={track.id} track={track} rank={track.rank} onClick={() => onTrackClick(track)} />
                        ))}
                    </ul>
                </div>

                {/* Rap Chart */}
                <div className="main-chart">
                    <h2 className="main-section-title">Rap Chart</h2>

                    <div className="main-video-card">
                        <div className="main-video-thumb">Rap</div>
                        <div className="main-video-info">
                            <div className="main-video-title">무작위 Rap 트랙</div>
                            <p className="main-video-desc">
                                무작위 Rap 트랙을 소개해드려요!
                            </p>
                        </div>
                    </div>

                    <ul className="main-chart-list">
                        {rapTracks.map((track) => (
                            <TrackRow key={track.id} track={track} rank={track.rank} onClick={() => onTrackClick(track)} />
                        ))}
                    </ul>
                </div>

            </section>
        </>
    );
}

export default ChartPage;
