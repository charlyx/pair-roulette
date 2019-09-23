import React from 'react'
import { useFirebaseAuth } from './firebase';

import { Preferences } from './Preferences'

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()

  return (
    <>
      <Preferences />
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={signOut}>Me déconnecter</button>
    </>
  )
}
