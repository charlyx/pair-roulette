import React from 'react'
import { useFirebaseAuth } from './firebase';

import { Preferences } from './Preferences'
import { usePreferences } from './usePreferences'

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()
  const [preferences, updatePreferences] = usePreferences()

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__trademark">Pair-Roulette</div>
        <button className="profile__signout" onClick={signOut}>Sign out</button>
      </header>
      <main>
        {preferences.length > 0 ? (
          <div>C'est parti!</div>
        ) : (
          <>
            <h1>Choose your languages preferences</h1>
            <Preferences
              initialValue={preferences}
              onSubmit={updatePreferences}
            />
          </>
        )}
      </main>
    </div>
  )
}
