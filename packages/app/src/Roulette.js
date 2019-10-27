import React from 'react'
import { useFirebaseAuth } from './firebase';

import { Preferences } from './Preferences'
import { useUpdatePreferences } from './useUpdatePreferences'

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()
  const updatePreferences = useUpdatePreferences()

  return (
    <>
      <Preferences onSubmit={updatePreferences} />
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={signOut}>Me déconnecter</button>
    </>
  )
}
