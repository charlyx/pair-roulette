const admin = require('firebase-admin')

async function roulette(uid, app) {
  const users = app.firestore().collection('users')

  const myDocument = users.doc(uid)

  const myPreferences = await myDocument.get()
    .then(doc => {
      if (!doc.exists) throw new Error(`User ${uid} does not exist.`)
      return doc.data().preferences
    })

  await myDocument.update({ available: false })

  let pair = undefined

  do {
    pair = await users
      .where('available', '==', true)
      .where('preferences', 'array-contains', myPreferences.shift())
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.empty) return undefined
        return snapshot.docs[0].data()
      })
  } while (!pair && myPreferences.length > 0)

  if (pair) {
    const pairRef = users.doc(pair.uid)

    return pairRef
      .update({ available: false })
      .then(() => pairRef.get())
      .then(doc => doc.data())
  }

  await myDocument.update({ available: true })

  return undefined
}

module.exports = roulette
