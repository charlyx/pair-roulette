const firebase = require('@firebase/testing')
const faker = require('faker')
const path = require('path')
const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)
const langages = require('./langages.json')
const roulette = require('./roulette.function.js')

faker.seed(123)
const projectId = 'pair-roulette'

describe('Roulette', () => {
  const app = getApp()

  beforeAll(async () => {
    const rulesPath = path.join(__dirname, 'firestore.rules')
    const rules = await readFileAsync(rulesPath, 'utf8')
    await firebase.loadFirestoreRules({ projectId, rules })
    await createRandomProfiles(app)
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))

    const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`
    console.log(`View rule coverage information at ${coverageUrl}\n`)
  })

  it('should match a user', async () => {
    const user = await getUser(app)

    const matchedUser = await roulette(user.uid, app)

    expect(matchedUser.preferences).toEqual(expect.arrayContaining(['ACC']))
  })

  it('should make users unavailable', async () => {
    const user = await getUser(app)

    const matchedUser = await roulette(user.uid, app)

    expect(user.available).toBe(false)
    expect(matchedUser.available).toBe(false)
  })

  it('should get last signed up user matching criterias', async () => {
    const user = await getUser(app)
    const expectedDate = new Date('2019-09-22').toDateString()

    const matchedUser = await roulette(user.uid, app)

    expect(matchedUser.createdAt.toDate().toDateString()).toEqual(expectedDate)
  })
})

function getApp() {
  return firebase.initializeAdminApp({ projectId })
}

function createRandomProfiles(app) {
  const batch = app.firestore().batch()

  for(let i = 0; i < 100; i++) {
    createRandomProfile(app, batch)
  }

  return batch.commit()
}

function createRandomProfile(app, batch) {
  const uid = faker.random.uuid()
  const createdAt = faker.date.between('2019-09-22', '2019-10-07')
  const ref = app.firestore().collection('users').doc(uid)

  batch.set(ref, {
    uid,
    displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    preferences: generatePreferences(),
    available: faker.random.boolean(),
    createdAt: firebase.firestore.Timestamp.fromDate(new Date(createdAt)),
  })
}

function generatePreferences() {
  const size = faker.random.number({ min: 1, max: 3 })
  const set = new Set()

  do {
    const index = faker.random.number({ min: 0, max: 20 })
    const lang = langages[index]

    if (set.has(lang)) continue

    set.add(lang)
  } while (set.size !== size)

  return [...set]
}

function getUser(app) {
  return app
    .firestore()
    .collection('users')
    .orderBy('createdAt', 'asc')
    .limit(1)
    .get()
    .then(snapshot => snapshot.docs[0])
    .then(doc => doc.data())
}
