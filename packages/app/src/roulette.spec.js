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
    const users = await getAllUsers(app)

    const matchedUser = await roulette(users[0].uid, app)

    expect(matchedUser.preferences.some(langage => users[0].preferences.includes(langage))).toBe(true)
  })

  it('should match an available user', async () => {
    const users = await getAllUsers(app)

    const matchedUser = await roulette(users[0].uid, app)

    expect(matchedUser.available).toBe(true)
  })

  it('should get last signed up user matching criterias', async () => {
    const users = await getAllUsers(app)

    const matchedUser = await roulette(users[0].uid, app)

    const date = firebase.firestore.Timestamp.fromDate(new Date('2019-10-06'))
    expect(matchedUser.createdAt).toEqual(date)
  })
})

function getApp() {
  return firebase.initializeAdminApp({ projectId })
}

function createRandomProfiles(app) {
  return Array.from({ length: 100 }, () => createRandomProfile(app))
}

function createRandomProfile(app) {
  const uid = faker.random.uuid()
  const createdAt = faker.date.between('2019-09-22', '2019-10-06')

  return app
    .firestore()
    .collection('users')
    .doc(uid)
    .set({
      uid,
      displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      preferences: generatePreferences(),
      available: faker.random.boolean(),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date(createdAt)),
    })
}

function generatePreferences() {
  const size = faker.random.number({ min: 1, max: 4 })
  const set = new Set()

  do {
    const index = faker.random.number({ min: 0, max: 20 })
    const lang = langages[index]

    if (set.has(lang)) continue

    set.add(lang)
  } while (set.size !== size)

  return [...set]
}

function getAllUsers(app) {
  return app
    .firestore()
    .collection('users')
    .get()
    .then(snapshot => snapshot.docs)
    .then(docs => docs.map(doc => doc.data()))
}
