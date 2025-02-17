import { useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import CustomCarousel from './components/PhotoSlides';
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
    interimResult,
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
    startSpeechToText()
    const lastResult = results[results.length - 1]
    console.log(lastResult, "<<<<<<<")
    if (mode === 'winston' && typeof lastResult === 'object' && lastResult.transcript.toLocaleLowerCase().trim().includes('stop listening')) {
      setMode('idle')
      console.log('set to idle<><><><>')
    }
    if (typeof lastResult === 'object' && lastResult.transcript.toLocaleLowerCase().includes('winston')) {
      setMode('winston')
      console.log('set to winton')
    }



  }, [results])


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
          <div style={{height: '100vh', width: '100vw'}}>
          <CustomCarousel>
            {photos.map((photo) => {
              return (
                <img src={photo} alt={photo}/>
              )
            })}

          </CustomCarousel>
          </div>
        </>
      }

    </>
  )
}

export default App
