import React from 'react';
import { useFirebaseAuth, AuthProvider } from '@use-firebase/auth';

export const LoginPage = () => {
  const { signIn, signInError, createAuthProvider } = useFirebaseAuth();

  const onSignIn = authProvider => {
    const provider = createAuthProvider(authProvider);
    signIn(provider);
  };

  return (
    <div>
      <h1>Please Sign In</h1>
      <p>
        <button onClick={() => onSignIn(AuthProvider.GITHUB)}>
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
