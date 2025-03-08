import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import Carousel from './components/Carousel/Carousel';
import Login from './login/Login';
import { socket } from './socket';
import { PatientForm } from './components/patientForm/PatientForm';
import { checkAuth } from './api/AuthApi';
import { contactRequest } from './api/ContactApi';
import { getImagesRequest } from './api/imageApi';
import { getPatient } from './api/PatientApi';

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
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([] as any[]);

  // 
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState('idle')
  const [photos, setPhotos] = useState([] as any[])
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [patientContacts, setPatientContacts] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents((previous: any[]) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);


  const getUser = async () => {
    try {
      const authUser = await checkAuth()
      localStorage.setItem('email', authUser.email)
      setUser(authUser)
      return authUser
    } catch (error) {
      throw error
    }
  }

  const getContacts = async() => {
    try {
      const contacts = await contactRequest()
      setPatientContacts(contacts)
      return contacts
    } catch (error) {
      throw error
    }
  }

  const getAndSetImages = async() => {
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
      setMode('login')
      throw error
    }
    try {
      await getPatient();
    } catch (error) {
      setMode('patientForm')
      throw error
    } 
    try {
      await getContacts()
    } catch (error) {
      setMode('patientForm')
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
      setLoading(true)
      startUp()
      setLoading(false)
    } catch (error) {
      throw error
    }

  }, []);

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
          console.log("set to idle");
        }
        if (transcript.includes("winston")) {
          setMode("winston");
          console.log("set to winston");
        }
      }
    } catch (error) {
      console.log("Speech Recognition Error:", error)
    }

  }, [results, isRecording]); // Ensure it only starts when needed


  return (
    <div className='app'>

      {mode === 'login' && <Login />}

      {mode === 'patientForm' && <PatientForm email={user?.email || ''} setMode={setMode} />}

      {mode === 'winston' &&
        <div className='assistant-constainer'>
          <Winston email={user?.email} mode={mode}></Winston>
        </div>}

      {mode === 'idle' && user && <Carousel images={photos} />}



    </div>
  )
}

export default App
