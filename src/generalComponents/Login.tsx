import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleSignInButton from './GoogleSignInButton';
import envConfig from '@/config/envConfig';

const Login = () => {
    const clientId = envConfig.get('googleClientId') as string;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Kanban Board</h1>
                <p className="text-gray-500 mt-2">Manage your tasks efficiently</p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account using Google
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <GoogleOAuthProvider clientId={clientId}>
                        <GoogleSignInButton />
                    </GoogleOAuthProvider>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;