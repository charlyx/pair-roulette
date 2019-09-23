import React from 'react';
import { useFirebaseAuth } from './firebase';

export const LoginPage = () => {
  const { signIn, signInError } = useFirebaseAuth();

  return (
    <div>
      <h1>Please Sign In</h1>
      <p>
        <button onClick={() => signIn()}>
          Sign In with GitHub
        </button>
      </p>
      {signInError && <div className="error-message">
        <h3>{signInError.code}</h3>
        {signInError.message}
      </div>}
    </div>
  );
};
