import React from 'react';
import { useFirebaseAuth } from './firebase';
import { Logo } from './Logo'

export const LoginPage = () => {
  const { signIn, signInError } = useFirebaseAuth();

  return (
    <div className="loginpage">
      <div className="loginpage__content">
        <Logo className="loginpage__logo" />
        <h1 className="loginpage__title">Pair Roulette</h1>
        <p className="loginpage__description">
          A platform for Open Source collaboration with random people all over the world
        </p>
        <button type="button" className="signin" onClick={signIn}>
          <img className="signin__github" src="/github.svg" alt="GitHub logo" /> Sign In with GitHub
        </button>
        {signInError && <div className="error-message">
          <h3>{signInError.code}</h3>
          {signInError.message}
        </div>}
      </div>
    </div>
  );
};
