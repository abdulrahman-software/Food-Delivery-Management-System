import { useEffect, useState } from 'react';
import Signin from '../services/Signin';
import Signup from '../services/Signup';

export default function AuthContainer({ defaultAuth, signedIn, setSignedIn, setAccountType }) {
  const [isSignIn, setIsSignIn] = useState(defaultAuth);
  useEffect(() => {
    setIsSignIn(defaultAuth);
  }, [defaultAuth]);
  const toggleAuthMode = () => setIsSignIn(prev => !prev);

  return (
    <>
      {isSignIn ? (
        <Signin toggleAuthMode={toggleAuthMode} signedIn={signedIn} setSignedIn={setSignedIn}  setAccountType={setAccountType}/>
      ) : (
        <Signup toggleAuthMode={toggleAuthMode} signedIn={signedIn} setSignedIn={setSignedIn}  setAccountType={setAccountType}/>
      )}
    </>
  );
}
