import React from 'react'
import { useFirebaseAuth } from './firebase';

import PreferencesPage from '../src/components/pages/PreferencesPage/index'

function RoulettePage() {
  const { signOut, user } = useFirebaseAuth()

  return (
    <>
      <PreferencesPage />
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={signOut}>Me déconnecter</button>
    </>
  )
}

export default RoulettePage