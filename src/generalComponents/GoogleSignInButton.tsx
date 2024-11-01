import React from "react";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { googleLogin } from '../slices/authSlice';


const GoogleSignInButton: React.FC = () => {

    const dispatch = useAppDispatch();

    const handleSuccess = async (response: CredentialResponse) => {
        console.log(response.credential)
        const token: string | undefined = response.credential;
        if (token) {

            const result = await dispatch(googleLogin({ token }));

            if (googleLogin.fulfilled.match(result)) {
                // Login successful
                console.log('Google login successful');
            }
        } else {
            console.log("no token")
        }
    }

    const handleFailure = () => {
        console.log("response")
    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
        />
    );
};


export default GoogleSignInButton;