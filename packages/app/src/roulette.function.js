const admin = require('firebase-admin')

async function roulette(uid, app) {
  const users = await app
    .firestore()
    .collection('users')
    .get()
    .then(snapshot => snapshot.docs)
    .then(docs => docs.map(doc => doc.data()))

  const me = users.find(user => user.uid === uid)

  const matches = users.filter(user => {
    return user.uid !== uid && user.available
  }).sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds
  }).find(user => {
    return user.preferences.some(langage => me.preferences.includes(langage))
  })

  return matches
}

module.exports = roulette
