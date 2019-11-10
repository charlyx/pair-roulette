import React, { useState, useEffect } from 'react'
import langages from './langages.json'
import { usePreferences } from './usePreferences'

export function Preferences() {
  const [preferences, setPreferences] = useState(['-1', '-1', '-1'])
  const [storedPreferences, updatePreferences] = usePreferences()

  useEffect(() => {
    setPreferences(storedPreferences)
  }, [storedPreferences])

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
      return updatePreferences(newPreferences)
    }}>
      <label htmlFor="firstLanguage">First language</label>
      <select
        id="firstLanguage"
        required
        onChange={e => {
          const { value } = e.target
          setPreferences([value, preferences[1], preferences[2]])
        }}
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
