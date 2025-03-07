import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Winston from './winston/page'
import useSpeechToText from 'react-hook-speech-to-text';
import Carousel from './components/Carousel/Carousel';
import Login from './login/Login';
import { socket } from './socket';

import axios from "axios";
import { PatientForm } from './components/patientForm/PatientForm';
import bigitSmallLogo from './assets/logos/bigitSmallLogo.jpg'
import { checkAuth } from './api/AuthApi';
import { contactRequest } from './api/ContactApi';
import { getImagesRequest } from './api/imageApi';
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
      console.log(value, "<><><><><><")
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
      const email = localStorage.getItem('email')
      console.log(email, '<<<email')
      const authUser = await checkAuth(email ? email : '')
      setUser(authUser)
      console.log(user, '<<user<><><')
      return authUser

    } catch (error) {
      throw error
    }
  }

  // const getContacts = async(user: User) => {
  //   try {
  //     const contacts = await contactRequest(user)
  //     setPatientContacts(contacts)
  //     return contacts
  //   } catch (error) {
  //     throw error
  //   }
  // }



  const startUp = useCallback(async () => {
    try {
      const authUser = await getUser()
      // await getContacts(authUser)
      // await getImagesRequest(user?.accessToken || '')


    } catch (error) {
      throw error
    }

  }, [])
  useEffect(() => {
    try {
      setLoading(true)
      startUp()
    } catch (error) {

    }

  }, []);



  //joining path of directory 
  async function listImages() {
    const filePaths = Object.keys(images);
    // console.log("Available images:", filePaths);

    return filePaths; // Return the list of image paths
  }

  useEffect(() => {
    console.log(user, '<<<<<')
  }, [user?.accessToken])

  const imageRequest = (accessToken: string, email: string) => {
    return axios
      .get(`http://localhost:3001/images/all/${email}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
  }

  const contactRequest = (accessToken: string, email: string) => {
    return axios
      .get(`http://localhost:3001/relatedPerson/email/${email}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
  }

  useEffect(() => {
    if (user?.accessToken) {
      const accessToken = user?.accessToken
      const email = user?.email
      console.log(email, "<<<<")
      localStorage.setItem("email", email);
      axios.all([imageRequest(accessToken, email), contactRequest(accessToken, email)]).then((responses) => {
        console.log(responses)
        setPhotos(responses[0].data.images.reduce((acc: string[], val: any) => {
          acc.push(val.url)
          return acc;
        }, []));
        setPatientContacts(responses[1].data)
      });
    }
    setTimeout(() => {
      setLoading(false)
    }, 2000)


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
    } catch (error) {
      console.log("Speech Recognition Error:", error)
    }

  }, [results, isRecording]); // Ensure it only starts when needed


  return (
    <div className='app'>

      {!user && <Login />}

      {patientContacts.length === 0 && <PatientForm email={user?.email || ''} setMode={setMode} />}

      {mode === 'winston' &&
        <div className='assistant-constainer'>
          <Winston email={user?.email} mode={mode}></Winston>
        </div>}

      {mode === 'idle' && user && <Carousel images={photos} />}



    </div>
  )
}

export default App
