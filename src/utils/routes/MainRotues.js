import { Navigate, Outlet } from "react-router-dom";
import { useToken } from "../TokenContext";
import MainPage from "../../pages/MainPage";

const MainRoutes = ({ menu }) => {

    return (
        <>
            {/* 메인 페이지 */}
            <MainPage menu={menu} />
            {/* 기타경로 */}
            <Outlet/>
        </>
    );
};

export default MainRoutes;
