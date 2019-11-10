const React = require('react')
const { renderHook } = require('@testing-library/react-hooks')
const firebase = require('@firebase/testing')
const path = require('path')
const { promises: fs } = require('fs')
const { usePreferences } = require('./useUpdatePreferences')
const { useFirebaseApp, useFirebaseAuth } = require('./firebase')

const projectId = 'pair-roulette'

describe('useUpdatePreferences', () => {
  const user = { uid: 'alice' }
  const app = authedApp(user)

  beforeAll(async () => {
    useFirebaseAuth.mockReturnValue({
      loading: false,
      user,
    })
    useFirebaseApp.mockReturnValue(app)

    const rulesPath = path.join(__dirname, 'firestore.rules')
    const rules = await fs.readFile(rulesPath, 'utf8')
    await firebase.loadFirestoreRules({ projectId, rules })
  })

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId })
    await app.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        ...user,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        langages: ['JavaScript'],
      })
  })

  it('should return existing preferences', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePreferences())

    await waitForNextUpdate()

    expect(result.current[0]).toEqual(['JavaScript'])
  })

  it('should return existing preferences', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePreferences())
    const [langages, updateLangages] = result.current
    const newLangages = ['C#', 'Rust']

    updateLangages(newLangages)
    await waitForNextUpdate()

    expect(result.current[0]).toEqual(newLangages)
  })
})

function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth })
}

jest.mock('./firebase')
