import React, { useState } from 'react'
import { useFirebaseAuth, useFirebaseApp } from './firebase';
import { LanguageInput } from './LanguageInput'

export function Preferences() {
  const [preferences, setPreferences] = useState(['', '', ''])
  const app = useFirebaseApp('pair-roulette')
  const { user } = useFirebaseAuth()

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      app.firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          langages: preferences,
          modifiedAt: app.firestore.FieldValue.serverTimestamp(),
        })
      return false
    }}>
      <LanguageInput
        required
        value={preferences[0]}
        onChange={(value) => { setPreferences([value, ...preferences.slice(1)]) }}
        label="First language"
        name="first_language"
      />
      <LanguageInput
        value={preferences[1]}
        onChange={(value) => { setPreferences([preferences[0], value, preferences[2]]) }}
        label="Second language"
        name="second_language"
      />
      <LanguageInput
        value={preferences[2]}
        onChange={(value) => { setPreferences([...preferences.slice(0, 2), value]) }}
        label="Third language"
        name="third_language"
      />
      <button>Enregistrer</button>
    </form>
  )
}
