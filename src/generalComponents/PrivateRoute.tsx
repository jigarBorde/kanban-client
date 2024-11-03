import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface PrivateRouteProps {
    element: ComponentType;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element }) => {
    const { isAuthenticated } = useAppSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Element />;
};

export default PrivateRoute;