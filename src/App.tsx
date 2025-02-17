import { useState } from 'react'
import './App.css'
import Winston from './winston/page'
// import 'dotenv/config'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
      <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
        <Winston></Winston>
      </main>
    </>
  )
}

export default App
