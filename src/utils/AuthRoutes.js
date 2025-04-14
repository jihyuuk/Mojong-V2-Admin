import { Navigate, Outlet } from "react-router-dom";
import { useToken } from "./TokenContext";

const AuthRoutes = () => {

    const { token } = useToken();

    return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoutes;
