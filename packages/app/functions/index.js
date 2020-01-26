const functions = require('firebase-functions');
const firebase = require('firebase-admin')
const roulette = require('./roulette.function')

const app = firebase.initializeApp()

exports.askForMatch = functions.https.onCall(async (data, context) => {
  const sender = {
    uid: context.auth.uid,
    username: context.auth.token.name,
  }

  const pair = await roulette(sender.uid, app)

  if (!pair) return

  const { langages } = await app.firestore()
    .collection('users')
    .doc(sender.uid)
    .get()
    .then(docRef => docRef.data())

  const newInvite = {
    from: {
      ...sender,
      langages,
    },
    to: {
      uid: pair.uid,
      username: pair.username,
      langages: pair.langages,
    },
    mates: [sender.uid, pair.uid],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'PENDING',
  }

  const ref = await app.firestore().collection('invites').add(newInvite)

  return {
    id: ref.id,
    ...newInvite,
  }
});

exports.acceptInvite = functions.https.onCall(async ({ id }, context) => {
  await updateInvite(id, true)
});

exports.rejectInvite = functions.https.onCall(async ({ id, comment, mates }, context) => {
  await updateInvite(id, false, comment)

  await Promise.all(mates.map(userId => {
    return app.firestore().collection('users').doc(userId).update({
      available: true,
    })
  }))
});

function updateInvite(id, isAccepted = true, comment = '') {
  return app.firestore()
    .collection('invites')
    .doc(id)
    .update({
      status: isAccepted ? 'ACCEPTED' : 'REJECTED',
      comment,
    })
}
