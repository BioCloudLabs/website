import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from './../../services/userService';
import { notify } from './../../utils/notificationUtils';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const validateTokenAndProceed = async () => {
            try {
                const valid = await isTokenValid();
                setIsValid(valid);
                if (!valid) {
                    // Redirect to login or a specific error page based on token validation failure
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('Error validating token:', error);
                notify('Error validating token. Please try again later.', 'error');
                navigate('/error', { replace: true }); // Redirect to a generic error page
            }
        };

        validateTokenAndProceed();
    }, [navigate]);

    if (isValid === null) {
        // Optionally show a loading indicator or nothing until the check is complete
        return (
            <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold text-blue-500 mb-4">Loading...</h1>
                <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-green-500 w-12 h-12"></div>
            </div>
        </div>
        );
    }

    return isValid ? <>{children}</> : null; // Render children only if token is valid
};

export default AuthGuard;
