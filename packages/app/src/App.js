import React from 'react';
import { useFirebaseAuth } from './firebase';
import LoginPage from '../src/components/pages/LoginPage/index'
import Roulette from '../src/components/pages/RoulettePage/index'

function App() {
  const { isSignedIn, loading } = useFirebaseAuth()

  if (loading) return 'Chargement...'

  return (
    <div className="App">
      {isSignedIn ? <Roulette /> : <LoginPage />}
    </div>
  )
}

export default App;
