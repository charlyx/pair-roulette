import React, { useState } from 'react'

import { useFirebaseAuth } from './firebase';

import { Preferences } from './Preferences'
import { usePreferences } from './usePreferences'
import { useInvite } from './useInvite'
import { Finder } from './Finder'
import { Invite } from './Invite'

export function Roulette() {
  const { signOut, user } = useFirebaseAuth()
  const [preferences, updatePreferences] = usePreferences()
  const {invite, acceptInvite, rejectInvite, setInvite} = useInvite()

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__trademark">Pair-Roulette</div>
        <button className="profile__signout" onClick={signOut}>Sign out</button>
      </header>
      <main>
        {preferences.length > 0 ? (
          invite && invite.status === 'PENDING' ? (
            <Invite
              accept={acceptInvite}
              reject={rejectInvite} 
              languages={invite.from.langages}
              sent={invite.from.uid === user.uid}
            />
          ) : (
            <Finder onLoad={setInvite} />
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
