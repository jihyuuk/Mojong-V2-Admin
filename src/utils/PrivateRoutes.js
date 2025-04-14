import { Navigate, Outlet } from "react-router-dom";
import { useToken } from "./TokenContext";
import MainPage from "../pages/MainPage";

const PrivateRoutes = ({ menu }) => {

    const { token } = useToken();

    return token ?
        <>
            {/* 메인 페이지 */}
            <MainPage menu={menu} />
            {/* 기타경로 */}
            <Outlet />
        </>
        :
        <Navigate to="/login" replace />;
};

export default PrivateRoutes;
