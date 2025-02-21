import { useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import Carousel from './components/Carousel';
import LoginButton from './components/LoginButton';
const images = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,svg}");
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
  }, [user])


  useEffect(() => {
    listImages().then((images) => setPhotos(images))

  }, [])

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
    <>

      {!user && <LoginButton/>}

      {mode === 'winston'
        &&
        <div className='assistant-constainer'>
          <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
            <Winston email={user?.email} mode={mode}></Winston>
          </main>
        </div>}
   
        {mode === 'idle' && user && <Carousel images={photos}/>}

    

    </>
  )
}

export default App
