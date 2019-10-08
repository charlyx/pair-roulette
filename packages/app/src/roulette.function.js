const admin = require('firebase-admin')

async function roulette(uid, app) {
  const users = app.firestore().collection('users')

  const myDocument = users.doc(uid)

  const myPreferences = await myDocument.get()
    .then(doc => doc.data())
    .then(me => me.preferences)

  await myDocument.update({ available: false })

  let pair = undefined

  do {
    pair = await users
      .where('available', '==', true)
      .where('preferences', 'array-contains', myPreferences.shift())
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
      .then(snapshot => snapshot.docs[0])
      .then(doc => doc.data())
  } while (!pair)

  if (pair) {
    return users.doc(pair.uid)
      .update({ available: false })
      .then(() => ({
        ...pair,
        available: false,
      }))
  }

  return myDocument.update({ available: true })
}

module.exports = roulette
