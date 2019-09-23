import React from 'react';
import { useFirebaseAuth } from './firebase';
import { LoginPage } from './LoginPage'
import { Roulette } from './Roulette'

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
