import { Navigate, Outlet } from "react-router-dom";
import MainPage from "../../pages/MainPage";
import { useMenu } from "../MenuProvider";
import LoadingMain from "../../components/LoadingMain";

const MainRoutes = () => {

    const { menu, isLoading } = useMenu();

    return (
        <>
            {/* 메인 페이지 */}
            {isLoading ? <LoadingMain /> : <MainPage menu={menu} />}
            {/* 기타경로 */}
            <Outlet />
        </>
    );
};

export default MainRoutes;
