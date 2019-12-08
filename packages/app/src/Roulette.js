import React from 'react'

import { useFirebaseAuth, useFirebaseApp } from './firebase';

import { Preferences } from './Preferences'
import { usePreferences } from './usePreferences'
import { useInvite } from './useInvite'

const app = useFirebaseApp()
const askForMatch = app.functions().httpsCallable('askForMatch')

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()
  const [preferences, updatePreferences] = usePreferences()
  const [invite, acceptInvite] = useInvite()

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__trademark">Pair-Roulette</div>
        <button className="profile__signout" onClick={signOut}>Sign out</button>
      </header>
      <main>
        {preferences.length > 0 ? (
          invite ? (
            <div>
              {invite.mates.join(' VS ')}
              {invite.to.uid === user.uid ? (
                <>
                  <button onClick={() => acceptInvite(true)}>Accept match</button>
                  <button onClick={() => acceptInvite(false)}>Reject match</button>
                </>
              ) : (
                <p>Invite sent</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => askForMatch()}
            >
              Find a pair-programming mate!
            </button>
          )
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
