import React from 'react'
import { useFirebaseAuth } from './firebase';

import { Preferences } from './Preferences'
import { useUpdatePreferences } from './useUpdatePreferences'

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()
  const updatePreferences = useUpdatePreferences()

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__trademark">Pair-Roulette</div>
        <button className="profile__signout" onClick={signOut}>Sign out</button>
      </header>
      <main>
        <h1>Choose your languages preferences</h1>
        <Preferences onSubmit={updatePreferences} />
      </main>
    </div>
  )
}
