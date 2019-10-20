import React, { Fragment } from 'react'
import { func, string, bool } from 'prop-types'
import languages from './langages.json'

LanguageInput.propTypes = {
  onChange: func.isRequired,
  value: string,
  label: string.isRequired,
  name: string.isRequired,
  required: bool,
}

LanguageInput.defaultProps = {
  value: '',
  required: false,
}

export function LanguageInput({ onChange, value, label, name, required }) {
  const datalistId = `${name}-list`
  return (
    <Fragment>
      <label>
        {label} 
        <input
          required={required}
          name={name}
          type="text"
          list={datalistId}
          onBlur={e => {
            const self = e.target
            if (!self.value) return
            const firstMatchedLanguage = findMatchingLanguage(self.value)
            onChange(firstMatchedLanguage)
          }}
          onChange={e => {
            const self = e.target
            const foundLanguage = findMatchingLanguage(self.value)
            if (foundLanguage) {
              onChange(self.value)
            }
          }}
          value={value}
        />
      </label>
      <datalist id={datalistId}>
        {languages.map(language => (
          <option key={language} value={language} />
        ))}
      </datalist>
    </Fragment>
  )
}

function findMatchingLanguage(value) {
  const valueLowerCase = value.toLowerCase()
  return languages.find(language => language.toLowerCase().startsWith(valueLowerCase))
}
