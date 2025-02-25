import { useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import Carousel from './components/Carousel/Carousel';
import Login from './login/Login';

import axios from "axios";
import {PatientForm} from './components/patientForm/PatientForm';
const images = import.meta.glob("/src/assets/*.{png,jpg,jpeg,svg}");
// import { PhotoSlides } from './components/PhotoSlides';
// import 'dotenv/config'

export type User = {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  picture: string;
  createdAt: string; // ISO date string
  __v: number;
  accessToken?: string; // Optional if you don't always return it
};

function App() {
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState('idle')
  const [photos, setPhotos] = useState([] as any[])
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return

        setUser(data)})
      .catch(() => setUser(null));
  }, []);



  //joining path of directory 
  async function listImages() {
    const filePaths = Object.keys(images);
    // console.log("Available images:", filePaths);

    return filePaths; // Return the list of image paths
  }

  useEffect(() => {
    console.log(user,'<<<<<')
  }, [user?.accessToken])

  useEffect(() => {
    if (user?.accessToken) {
      const accessToken = user?.accessToken
      axios
        .get(`http://localhost:3001/images`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setPhotos(response.data.images.reduce((acc: string[], val: any) => {
            acc.push(val.url)
            return acc;
          }, []));
        })
        .catch((error) => console.error("Error fetching images:", error))
        // .finally(() => setLoading(false));
    }
  }, [user?.accessToken]);


  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    try {
      if (!isRecording) {
        startSpeechToText();
      }
    
      const lastResult = results[results.length - 1];
    
      if (lastResult && typeof lastResult === "object") {
        const transcript = lastResult.transcript.toLowerCase().trim();
    
        if (mode === "winston" && transcript.includes("stop listening")) {
          setMode("idle");
          console.log("set to idle<><><><>");
        }
        if (transcript.includes("winston")) {
          setMode("winston");
          console.log("set to winston");
        }
      }
    } catch (error){
      console.log("Speech Recognition Error:", error)
    }
    
  }, [results, isRecording]); // Ensure it only starts when needed


  return (
    <div className='app'>
       {!user && <Login/>}

      {/* {mode === 'winston'
        &&
        <div className='assistant-constainer'>
            <Winston email={user?.email} mode={mode}></Winston> 
        </div>} 
   
         {/* {mode === 'idle' && user && <Carousel images={photos}/>}   */}

    <PatientForm email={user?.email || ''} /> 

    </div>
  )
}

export default App
