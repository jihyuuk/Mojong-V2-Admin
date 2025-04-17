import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DetailPage from './pages/DetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import { TostProvider } from './utils/TostProvider';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ShoppingCartProvider } from './utils/ShoppingCartProvider';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/login/JoinPage';
import HistoryPage from './pages/staff/HistoryPage'
import CashierOrderPage from './pages/CashierOrderPage';
import SearchPage from './pages/SearchPage';
import { TokenProvider } from './utils/TokenContext';
import AuthRoutes from './utils/routes/AuthRoutes';
import PrivateRoutes from './utils/routes/PrivateRoutes';
import MainRoutes from './utils/routes/MainRotues';
import HistoryDetailPage from './pages/staff/HistoryDetailPage';
import MemberPage from './pages/staff/MemberPage';
import CustomProductPage from './pages/staff/CustomProductPage';
import ProductPage from './pages/staff/ProductPage';
import { MenuProvider } from './utils/MenuProvider';

function App() {

  return (
    <div className="App">
      <BrowserRouter>{/* react-rotuer-dom */}
        <TokenProvider>{/* 토큰 useState로 관리 불러오기, 업데이트, 삭제 */}
          <TostProvider>{/* 토스트 기능 context */}
            <MenuProvider>{/* 메뉴 불러오기 */}
              <ShoppingCartProvider> {/* 장바구니 */}
                <Routes>

                  {/* 로그인 후 이용 가능 */}
                  <Route element={<PrivateRoutes />}>
                    {/* 메인페이지 위에 레이어 쌓기 */}
                    <Route element={<MainRoutes />}>
                      {/* 더미 홈 */}
                      <Route path="/" element={null} />
                      {/* 검색 페이지 */}
                      <Route path="/search" element={<SearchPage />} />
                      {/* 아이템 상세 페이지 */}
                      <Route path="/detail" element={<DetailPage />} />
                      {/* 장바구니 페이지 */}
                      <Route path="/shoppingCart" element={<ShoppingCartPage />} />
                      {/* 직원결제 페이지 */}
                      <Route path="/cashier-order" element={<CashierOrderPage />} />
                    </Route>

                    {/* 기타 */}
                    <Route path='/custom-item' element={<CustomProductPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/history/:id" element={<HistoryDetailPage />} />

                    <Route path="/members" element={<MemberPage />} />
                    <Route path="/product" element={<ProductPage />} />
                  </Route>

                  {/* 로그인, 회원가입 페이지 */}
                  <Route element={<AuthRoutes />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />
                  </Route>

                  {/* 이상한 경로 접근시 홈으로 리다이렉트 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ShoppingCartProvider>
            </MenuProvider>
          </TostProvider>
        </TokenProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
