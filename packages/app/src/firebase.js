import React, { useEffect, useContext, useState, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
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
      if (user) {
        try {
          const signedInUser = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }

          const { additionalUserInfo } = await firebase.auth().getRedirectResult()

          if (additionalUserInfo) {
            signedInUser.username = additionalUserInfo.username
          }

          const ref = await firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .get()

          if (!ref.exists) {
            await firebase.firestore()
              .collection('users')
              .doc(signedInUser.uid)
              .set(signedInUser)
          }
          setUser(signedInUser)
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
