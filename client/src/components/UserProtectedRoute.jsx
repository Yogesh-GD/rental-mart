import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import Cookies from "js-cookie";


const UserProtectedRoute = ({ role }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const isUserAuthenticated = Cookies.get("isUserAuthenticated") === 'true'
    useEffect(() => {
      if(isUserAuthenticated){
        setIsInitialized(true)
      }
    }, []);

    if (role === "user" && !isInitialized && !isUserAuthenticated ) return <Navigate to="/auth/user/login" />;

    return <Outlet />;
};


export default UserProtectedRoute