// import 'dotenv/config'
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {} from 'react-dom'
// import useSound from 'use-sound';
import Winston from './winston/page.js'
import useSpeechToText from 'react-hook-speech-to-text';
import Carousel from './components/Carousel/Carousel.js';
import Login from './login/Login.js';
import socket from './socket.js';
import { PatientForm } from './components/patientForm/PatientForm.js';
import { checkAuth } from './api/AuthApi.js';
import { contactRequest } from './api/ContactApi.js';
import { getImagesRequest } from './api/imageApi.js';
import { getPatient } from './api/PatientApi.js';
// import Button from './components/Button/Button';
// import mySound from "./assets/sounds/start_up.mp3";
import { WebRTC } from './components/WebRTC/WebRTC.js';
import { User } from './types/User.js';
import { ModesEnum } from './types/Modes.js';
import { AxiosProvider } from './providers/axiosProvider.js';


function App() {
  // const [webRTCMessage, setWebRTCMessage] = useState<any>()
  // 
  const [mode, setMode] = useState('idle')
  const [photos, setPhotos] = useState([] as any[])
  const [user, setUser] = useState<User | null>(null);
  const [patientContacts, setPatientContacts] = useState([])
  const [isCallingOutbound, setIsCallingOutbound] = useState(false)
  const [answered, setAnswered] = useState(false)

  const getUser = async () => {
    try {
      const authUser = await checkAuth()
      if (authUser) {
        socket.emit("register", authUser.email);
        setUser(authUser)
      }

      // socket.emit('register', authUser?.email);
      return authUser
    } catch (error) {
      throw error
    }
  }

  const getContacts = async () => {
    try {
      const contacts = await contactRequest()
      setPatientContacts(contacts)
      return contacts
    } catch (error) {
      throw error
    }
  }

  const getAndSetImages = async () => {
    try {
      const images = await getImagesRequest();
      setPhotos(images);
    } catch (error) {
      throw error
    }
  }

  const startUp = useCallback(async () => {
    try {
      await getUser();

    } catch (error) {
      setMode(ModesEnum.LOGIN)
      throw error
    }
    try {
      await getPatient();
    } catch (error) {
      setMode(ModesEnum.PATIENT_FORM)
      throw error
    }
    try {
      await getContacts()
    } catch (error) {
      setMode(ModesEnum.PATIENT_FORM)
      throw error
    }
    try {
      await getAndSetImages();
      setMode('idle')
    } catch (error) {

    }
  }, [])


  useEffect(() => {
    try {
      startUp()
      function onConnect() {
        // setIsConnected(true);
      }
      function onDisconnect() {
        // setIsConnected(false);
      }
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('message', (message: any) => {
        // const {callerName, recipiantName} = message
        if (message.type === ModesEnum.WEBRTC) {
          if (message.toEmail) {
            // setCaller(recipiantName)
            setIsCallingOutbound(true)
          }
          else {
            // setCaller(callerName)
          }
          console.log(message.message, '<><>')
          // setWebRTCMessage(message)
          setMode(ModesEnum.WEBRTC)

        }

      })
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      };
    } catch (error) {
      throw error
    }

  }, []);

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    // stopSpeechToText,
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
        console.log(transcript, '<<<<<')

        if (mode === ModesEnum.WEBRTC && transcript.includes("stop listening")) {
          console.log("set to idle");
          setMode(ModesEnum.IDLE);
        }

        if (mode === ModesEnum.WINSTON && transcript.includes("stop listening")) {
          console.log("set to idle");
          setMode(ModesEnum.IDLE);
        }
        if (mode === ModesEnum.WINSTON && transcript.includes("answer") && isCallingOutbound) {
          setAnswered(true)
          console.log("set to idle");
        }
        if (transcript.includes(ModesEnum.WINSTON)) {
          setMode(ModesEnum.WINSTON);
          console.log("set to winston");
        }
      }

    } catch (error) {
      console.log("Speech Recognition Error:", error)
    }

  }, [results, isRecording]); // Ensure it only starts when needed

  return (
    <AxiosProvider>
    <div className='app'>

      {mode === ModesEnum.LOGIN && <Login />}

      {mode === ModesEnum.PATIENT_FORM && <PatientForm email={user?.email || ''} setMode={setMode} />}

      {mode === ModesEnum.WINSTON &&
        <div className='assistant-constainer'>
          <Winston email={user?.email} mode={mode}></Winston>
        </div>}

      {mode === 'idle' && user && <Carousel images={photos} />}

      {mode === 'WEBRTC' && user &&
        <WebRTC
          setMode={setMode}
          answered={answered}
          isCallingOutbound={isCallingOutbound}
          socket={socket}
          patientEmail={user.email}
          patientContacts={(patientContacts[0] as any).telecom[1].value} />}

      {/* {mode !== 'WEBRTC' && <Button onClick={() => setMode('WEBRTC')}>WEBRTC</Button>} */}
    </div>
    </AxiosProvider>
  )
}

export default App