import React, { useState } from 'react'
import ReactSelect from 'react-select'
import { useFirebaseAuth } from '@use-firebase/auth';
import { useFirebaseApp } from '@use-firebase/app'
import langages from './langages.json'

const options = langages.map(lang => ({
  value: lang,
  label: lang,
}))

export function Preferences() {
  const [preferences, setPreferences] = useState([])
  const app = useFirebaseApp()
  const { user } = useFirebaseAuth()

  return (
    <form onSubmit={() => {
      app.firestore()
        .collection('users')
        .doc(user.uid)
        .update({ langages })
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
