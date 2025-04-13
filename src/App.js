import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import { TostProvider } from './utils/TostProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ShoppingCartProvider, useShoppingCart } from './utils/ShoppingCartProvider';
import { useEffect, useState } from 'react';
import LoadingMain from './components/LoadingMain';
import axios from 'axios';
import axiosWithToken from './utils/axiosWithToken';
import CashierOrderPage from './pages/CashierOrderPage';
import SearchPage from './pages/SearchPage';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [token, setToken] = useState(null);

  //1. 토큰 초기화
  useEffect(() => {

    //토큰 로컬스토리지에서 꺼내오기
    const localToken = localStorage.getItem('token');

    //토큰 존재시 넘어가기
    if (localToken) {
      setToken(localToken);
      return;
    }

    //토큰 서버로 받아오기
    axios.get('http://192.168.0.3:8080/guest-token')
      .then(response => {
        const newToken = response.headers['authorization'];
        localStorage.setItem('token', newToken);
        setToken(newToken); // 상태 업데이트
      })
      .catch(error => {
        alert("일시적인 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
      });

  }, []);


  //2. 메뉴 불러오기
  useEffect(() => {
    fetchMenu();
  }, [token]);


  //메뉴 불러오는 함수
  const fetchMenu = () => {
    //토큰이 있을 때만 실행
    if (!token) return;

    axiosWithToken.get('/menu')
      .then((response) => {
        //메뉴 세팅
        setMenu(response.data);
        //로딩 끝
        setIsLoading(false);
      })
      .catch((error) => {
        alert("상품을 불러오지 못 했습니다. 관리자에게 문의해주세요.");
      });
  }


  //로딩시
  if (isLoading) {
    return (<LoadingMain />);
  }

  //로딩 끝
  return (
    <div className="App">
      <BrowserRouter>{/* react-rotuer-dom */}
        <TostProvider>{/* 토스트 기능 context */}
          <ShoppingCartProvider menu={menu}>

            {/* 메인 페이지 */}
            <MainPage menu={menu} />

            <Routes>
              {/* 더미 홈 */}
              <Route path="/" element={null} /> 
              
              {/* 검색 페이지 */}
              <Route path="/search" element={<SearchPage menu={menu} />} />
              {/* 아이템 상세 페이지 */}
              <Route path="/detail" element={<DetailPage />} />
              {/* 장바구니 페이지 */}
              <Route path="/shoppingCart" element={<ShoppingCartPage />} />

              {/* 직원결제 페이지 */}
              <Route path="/cashier-order" element={<CashierOrderPage fetchMenu={fetchMenu} />} />
            </Routes>

          </ShoppingCartProvider>
        </TostProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
