import React, { useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleSignInButton from './generalComponents/GoogleSignInButton';
import envConfig from './config/envConfig';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { loadProfile, logoutUser } from './slices/authSlice';



const clientId = envConfig.get('googleClientId') as string;


const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);


  useEffect(() => {
    console.log("Hello World!")
    if (!user) {
      dispatch(logoutUser());
    }

  }, [user])


  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <h1>React OAuth</h1>
        <p>Click the button below to sign in with Google</p>
        <GoogleSignInButton />
      </div>
    </GoogleOAuthProvider>
  )
};

export default App
