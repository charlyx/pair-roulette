import { useFirebaseAuth, useFirebaseApp } from './firebase';

export function useUpdatePreferences() {
  const app = useFirebaseApp('pair-roulette')
  const { user } = useFirebaseAuth()

  return preferences => app.firestore()
    .collection('users')
    .doc(user.uid)
    .update({
      langages: preferences.map(({ value }) => value),
      modifiedAt: app.firestore.FieldValue.serverTimestamp(),
    })
}
