import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import Cookies from "js-cookie";


const AdminProtectedRoute = ({ role }) => {
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);
    const isAdminAuthenticated = Cookies.get("isAdminAuthenticated") === 'true'
    useEffect(() => {
      if(isAdminAuthenticated){
        setIsInitialized(true)
      }
    }, [dispatch,]);


    if (role === "admin" && !isInitialized && !isAdminAuthenticated ) return <Navigate to="/auth/admin/login" />;

    return <Outlet />;
};


export default AdminProtectedRoute