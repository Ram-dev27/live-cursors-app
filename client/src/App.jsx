import { useState } from 'react'
import Login from './components/Login'
import Home from './components/Home'

function App() {
  const [userName,setUserName] = useState('')

  return (
    <>
    {!userName ? 
    <Login onSubmit={setUserName}/> :
    <Home userName={userName} />
    
  }
    </>
  )
}

export default App
