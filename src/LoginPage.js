import React, { useEffect } from 'react';
import './LoginPage.css';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const signIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log("Login Success", result.user);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <div className="login">
            <h1 className="login-logo">OSS MUSIC</h1>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <button onClick={signIn} className="login-btn">SIGN IN WITH GOOGLE</button>
        </div>
    );
}

export default LoginPage;
