const firebase = require('@firebase/testing')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises;
const projectId = 'pair-roulette'

describe('Firestore rules', () => {
  beforeAll(async () => {
    const rulesPath = path.join(__dirname, 'firestore.rules')
    const rules = await fsPromises.readFile(rulesPath, 'utf8')
    await firebase.loadFirestoreRules({ projectId, rules })
  })

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId })
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))

    const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`
    console.log(`View rule coverage information at ${coverageUrl}\n`)
  })

  it('require users to log in before creating a profile', async () => {
    const anonymous = authedApp(null)

    const profile = createProfile(anonymous, 'alice')

    await firebase.assertFails(profile)
  })

  it('should allow users to create a profile', async () => {
    const alice = authedApp({ uid: 'alice' })

    const profile = createProfile(alice, 'alice')

    await firebase.assertSucceeds(profile)
  })

  it('should enforce the createdAt date in user profiles', async () => {
    const alice = authedApp({ uid: 'alice' })

    const profile = alice.collection('users').doc('alice').set({ uid: 'alice' })

    await firebase.assertFails(profile)
  })

  it('should only let users create their own profile', async () => {
    const alice = authedApp({ uid: 'alice' })

    const bobProfile = createProfile(alice, 'bob')

    await firebase.assertFails(bobProfile)
  })

  it('should allow owner to read document', async () => {
    const alice = authedApp({ uid: 'alice' })

    await createProfile(alice, 'alice')

    await firebase.assertSucceeds(getProfile(alice, 'alice'))
  })

  it('should only allow owner to read document', async () => {
    const alice = authedApp({ uid: 'alice' })
    const bob = authedApp({ uid: 'bob' })

    await createProfile(alice, 'alice')

    await firebase.assertFails(getProfile(bob, 'alice'))
  })

  it('should allow owner to update document', async () => {
    const alice = authedApp({ uid: 'alice' })
    await createProfile(alice, 'alice')

    const profile = updateProfile(alice, 'alice')

    await firebase.assertSucceeds(profile)
  })

  it('should enforce the modifiedAt date in user profiles', async () => {
    const alice = authedApp({ uid: 'alice' })
    await createProfile(alice, 'alice')

    const profile = alice.collection('users').doc('alice').update({ uid: 'alice' })

    await firebase.assertFails(profile)
  })

  it('should only let users update their own profile', async () => {
    const alice = authedApp({ uid: 'alice' })
    await createProfile(alice, 'alice')
    const bob = authedApp({ uid: 'bob' })

    const profile = updateProfile(bob, 'alice')

    await firebase.assertFails(profile)
  })
})

function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore()
}

function createProfile(app, uid) {
  return app
    .collection('users')
    .doc(uid)
    .set({
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

function getProfile(app, uid) {
  return app
    .collection('users')
    .doc(uid)
    .get()
}

function updateProfile(app, uid) {
  return app
    .collection('users')
    .doc(uid)
    .update({
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
