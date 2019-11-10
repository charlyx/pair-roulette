import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useFirebaseAuth, useFirebaseApp } from './firebase';

export function usePreferences() {
  const [langages, setLangages] = useState([])
  const app = useFirebaseApp('pair-roulette')
  const { user, loading } = useFirebaseAuth()

  useEffect(() => {
    if (loading) return
    app
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(doc => doc.data())
      .then(data => data.langages)
      .then(setLangages)
  }, [loading])

  return [
    langages,
    newLangages => app.firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        langages: newLangages,
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => setLangages(langages))
  ]
}
