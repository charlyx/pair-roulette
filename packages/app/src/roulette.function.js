const admin = require('firebase-admin')

async function roulette(uid, app) {
  const users = await app
    .firestore()
    .collection('users')
    .orderBy('createdAt', 'desc')
    .where('available', '==', true)
    .get()
    .then(snapshot => snapshot.docs)
    .then(docs => docs.map(doc => doc.data()))

  const me = users.find(user => user.uid === uid)

  return users
    .filter(user => user.uid !== uid)
    .find(user => user.preferences.some(lang => me.preferences.includes(lang)))
}

module.exports = roulette
