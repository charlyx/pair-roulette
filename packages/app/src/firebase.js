import React, { useEffect, useContext, useState, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from './config.json'

firebase.initializeApp(config)

const AuthContext = createContext()

export function useFirebaseAuth() {
  return useContext(AuthContext)
}

export function useFirebaseApp() {
  return firebase
}

export function FirebaseAuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [signInError, setSignInError] = useState(true)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      console.log({ user })
      if (user) {
        // User is signed in.
        try {
          const { credential } = await firebase.auth().getRedirectResult()
          // Call GitHub API to get user info
          let username
          const accessToken = credential && credential.accessToken
          if (accessToken) {
            try {
              const resp = await fetch('https://api.github.com/user', {
                method: 'GET',
                headers: {
                  'content-type': 'application/json',
                  Authorization: `token ${accessToken}`,
                },
              })
              const data = await resp.json()
              username = data.login
            } catch (e) {
              console.error('Unable to get https://api.github.com/user')
              console.error(e)
            }
          }

          const signedInUser = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }
          setUser(signedInUser)
          try {
            await firebase.firestore()
              .collection('users')
              .doc(signedInUser.uid)
              .set(signedInUser)
          } catch (e) {
            console.log('Some error with firebase', e)
          }
          setIsSignedIn(true)
        } catch (e) {
          setSignInError(e)
        }
      } else {
        setUser(null)
        setIsSignedIn(false)
      }
      setLoading(false)
    })
  }, [])

  const signIn = async () => {
    const provider = new firebase.auth.GithubAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }

  const signOut = async () => {
    setUser(null)
    setIsSignedIn(false)
    await firebase.auth().signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        loading,
        signIn,
        signOut,
        signInError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
