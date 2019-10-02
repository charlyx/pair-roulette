import React, { useState } from 'react'
import ReactSelect from 'react-select'
import { useFirebaseAuth, useFirebaseApp } from './firebase.js';
import langages from './langages.json'

const options = langages.map(lang => ({
  value: lang,
  label: lang,
}))

export function Preferences() {
  const [preferences, setPreferences] = useState([])
  const app = useFirebaseApp('pair-roulette')
  const { user } = useFirebaseAuth()

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      app.firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          langages: preferences.map(({ value }) => value),
          modifiedAt: app.firestore.FieldValue.serverTimestamp(),
        })
      return false
    }}>
      <ReactSelect
        options={options}
        isMulti
        name="langages"
        value={preferences}
        onChange={options => {
          setPreferences([].concat(options))
        }}
      />
      <button>Enregistrer</button>
    </form>
  )
}
