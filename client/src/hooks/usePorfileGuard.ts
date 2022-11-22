import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

const authPaths = ['/sign-in'];

export const useProfileGuard = () => {
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authToken && !authPaths.includes(location.pathname)) {
            navigate('/sign-in');
        } else if (authToken && authPaths.includes(location.pathname)) {
            navigate('/');
        }
    }, []);
};
