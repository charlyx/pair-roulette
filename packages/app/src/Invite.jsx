import React from 'react'
import { func, string, bool, arrayOf } from 'prop-types'

import './Invite.css'

Invite.propTypes = {
  accept: func.isRequired,
  reject: func.isRequired,
  languages: arrayOf(string).isRequired,
  sent: bool,
}

Invite.defaultProps = {
  sent: false,
}

export function Invite({ accept, reject, languages, sent }) {
  return (
    <article className="invite">
      <h1 className="invite__title">Invite</h1>
      {sent ? (
        <p className="invite__description">Invite sent</p>
      ) : (
        <>
          <div className="invite__avatar">?</div>
          <p className="invite__description">Invite received from a person who likes these languages: {languages.join(', ')}</p>
          <div>
            <button className="invite__button" onClick={() => accept()}>Accept match</button>
            <button className="invite__button" onClick={() => {
                const comment = prompt('Any comment?')
                reject(comment)
              }}
            >
              Reject match
            </button>
          </div>
        </>
      )}
    </article>
  )
}

