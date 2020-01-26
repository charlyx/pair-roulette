import React, { useState } from 'react'
import { func } from 'prop-types'
import { useFirebaseAuth, useFirebaseApp } from './firebase';

import styles from './Finder.css'

const app = useFirebaseApp()
const askForMatch = app.functions().httpsCallable('askForMatch')

Finder.propTypes = {
  onLoad: func.isRequired,
}

export function Finder({ onLoad }) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="finder">
      <p className="finder__description">Find a pair-programming mate!</p>
      <button
        className={`finder__button${loading ? ' finder__button--loading' : ''}`}
        onClick={() => {
          setLoading(true)
          askForMatch()
            .then(result => {
              setLoading(false)
              onLoad(result.data)
            })
        }}
      >
        {loading ? 'Searching...' : 'Go'}
      </button>
    </div>
  )
}
