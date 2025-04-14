import { Navigate, Outlet } from "react-router-dom";
import { useToken } from "../TokenContext";
import MainPage from "../../pages/MainPage";

const PrivateRoutes = () => {

    const { token } = useToken();

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
