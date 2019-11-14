import React, { useState, useEffect } from 'react'
import { array, func } from 'prop-types'
import langages from './langages.json'
import { usePreferences } from './usePreferences'

Preferences.propTypes = {
  initialValue: array.isRequired,
  onSubmit: func.isRequired,
}

export function Preferences({ initialValue, onSubmit }) {
  const [preferences, setPreferences] = useState(['-1', '-1', '-1'])

  useEffect(() => {
    setPreferences(initialValue)
  }, [initialValue])

  const firstLanguages = langages.filter(lang => {
    return ![preferences[1], preferences[2]].includes(lang)
  })
  const secondLanguages = langages.filter(lang => {
    return ![preferences[0], preferences[2]].includes(lang)
  })
  const thirdLanguages = langages.filter(lang => {
    return ![preferences[0], preferences[1]].includes(lang)
  })

  return (
    <form onSubmit={e => {
      e.preventDefault()
      const newPreferences = preferences.filter(lang => lang && lang !== '-1')
      return onSubmit(newPreferences)
    }}>
      <label htmlFor="firstLanguage">First language</label>
      <select
        id="firstLanguage"
        required
        onChange={e => {
          const { value } = e.target
          setPreferences([value, preferences[1], preferences[2]])
        }}
        value={preferences[0]}
      >
        <option value="-1">Please pick a language</option>
        {firstLanguages.map(lang => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
      <label htmlFor="secondLanguage">Second language</label>
      <select
        id="secondLanguage"
        onChange={e => {
          const { value } = e.target
          setPreferences([preferences[0], value, preferences[2]])
        }}
        value={preferences[1]}
      >
        <option value="-1">Please pick a language</option>
        {secondLanguages.map(lang => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
      <label htmlFor="thirdLanguage">Third language</label>
      <select
        id="thirdLanguage"
        onChange={e => {
          const { value } = e.target
          setPreferences([preferences[0], preferences[1], value])
        }}
        value={preferences[2]}
      >
        <option value="-1">Please pick a language</option>
        {thirdLanguages.map(lang => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
      <button>Enregistrer</button>
    </form>
  )
}
