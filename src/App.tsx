import { useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import CustomCarousel from './components/PhotoSlides';
import Carousel from './components/Carousel';
const images = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,svg}");
// import { PhotoSlides } from './components/PhotoSlides';
// import 'dotenv/config'



function App() {
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState('idle')
  const [photos, setPhotos] = useState([] as any[])
  const [index, setIndex] = useState(0);


  //joining path of directory 
  async function listImages() {
    const filePaths = Object.keys(images);
    // console.log("Available images:", filePaths);

    return filePaths; // Return the list of image paths
  }


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

      {mode === 'winston'
        ?
        <div className='assistant-constainer'>
          <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
            <Winston mode={mode}></Winston>
          </main>
        </div>
        :
        <>
        <Carousel images={photos}/>
        </>
      }

    </>
  )
}

export default App
