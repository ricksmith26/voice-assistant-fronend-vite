import './Login.css'
import logo from "../assets/logos/bigitSmallLogo.jpg"
import Button from "../components/Button/Button";
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

import start_up from '../assets/sounds/start_up.mp3';



export const apiUrl = process.env.api_url ? process.env.api_url : "http://localhost:3001/auth/google";

const Login = () => {
    const [loaded, setLoaded] = useState(false);
    const [play] = useSound(start_up);

    useEffect(() => {
        setTimeout(() => {
            console.log('start music')
            play()
        }, 1000)
        setTimeout(() => {
            console.log('start fade in')
            setLoaded(true)
        }, 2000)
    },[])

    return (
        <div className="loginBackGround">
            <img src={logo} />
            <div style={{ position: 'relative', marginTop: '24px', width: "100%" }}>
                <div className="centered-container">
                    <div className="appearing-container" style={{opacity: loaded ? 1 : 0}}>
                        <Button onClick={() => window.location.href = apiUrl}>Login with Google</Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;