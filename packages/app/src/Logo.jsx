import React from 'react'
import { string } from 'prop-types'

Logo.propTypes = {
  className: string,
}

Logo.defaultProps = {
  className: '',
}

export function Logo({ className }) {
  return ( 
    <div className={`logo ${className}`}>
      <div className="logo__girl">👩‍💻</div>
      <div className="logo__earth">🌍</div>
      <div className="logo__boy">👨‍💻</div>
    </div>
  )
}
