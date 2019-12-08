import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useFirebaseAuth, useFirebaseApp } from './firebase';

export function useInvite() {
  const [invite, setInvite] = useState()
  console.log(invite)
  const app = useFirebaseApp('pair-roulette')
  const { user, loading } = useFirebaseAuth()

  useEffect(() => {
    if (loading) return
    const ref = app
      .firestore()
      .collection('invites')
      .where('mates', 'array-contains', user.uid)
      .where('status', '==', 'PENDING')
      .get()

    ref
      .then(snapshot => snapshot.docs[0].data())
      .then(data => setInvite({ id: ref.id, ...data }))
  }, [loading])

  return [
    invite,
    (isAccepted = true) => app.firestore()
      .collection('invites')
      .doc(invite.id)
      .update({
        status: isAccepted ? 'ACCEPTED' : 'REJECTED',
      })
      .then(() => setInvite({ ...invite, status: isAccepted ? 'ACCEPTED' : 'REJECTED' }))
  ]
}
