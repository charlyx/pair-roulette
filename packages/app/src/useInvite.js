import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useFirebaseAuth, useFirebaseApp } from './firebase';

const app = useFirebaseApp('pair-roulette')
const acceptInvite = app.functions().httpsCallable('acceptInvite')
const rejectInvite = app.functions().httpsCallable('rejectInvite')

export function useInvite() {
  const [invite, setInvite] = useState()
  const { user, loading } = useFirebaseAuth()

  useEffect(() => {
    if (loading) return
    const ref = app
      .firestore()
      .collection('invites')
      .where('mates', 'array-contains', user.uid)
      .where('status', '==', 'PENDING')
      .get()

      .then(async snapshot => {
        if (!snapshot.docs.length) return
        const data = await snapshot.docs[0].data()
        setInvite({
          id: snapshot.docs[0].id,
          ...data,
        })
      })
  }, [loading])

  return {
    invite,
    setInvite,
    acceptInvite: () => acceptInvite({ id: invite.id }).then(() => {
      setInvite({ ...invite, status: 'ACCEPTED' })
    }),
    rejectInvite: comment => rejectInvite({
      id: invite.id,
      comment,
      mates: invite.mates,
    }).then(() => {
      setInvite({ ...invite, status: 'REJECTED' })
    }),
  }
}
