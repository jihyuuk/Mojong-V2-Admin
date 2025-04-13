import React from "react";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { useShoppingCart } from "../utils/ShoppingCartProvider";

function SuccessPage({ fetchMenu }) {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCartItems } = useShoppingCart();

  return (
    <div className="z-1 position-absolute top-0 start-0 w-100 h-100 bg-white">
      <div className='d-flex flex-column h-100'>

        {/* 로딩 서클 */}
        <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
          <div className="circle-loader load-complete">
            <div className="checkmark draw"></div>
          </div>
          {/* 주문 성공 메시지 */}
          <div className="mt-3 fs-1 fw-semibold">주문 번호 : #7</div>
          <div className="mt-1">주문이 정상적으로 처리되었습니다.</div>
        </div>

        <Footer value={"홈으로"} show={true} onClick={() => {
          //장바구니 초기화 
          setCartItems([]);
          //메뉴 초기화
          fetchMenu();
          //홈화면 이동
          navigate("/", { replace: true });
        }} />
      </div>
    </div>
  );
}

export default SuccessPage;