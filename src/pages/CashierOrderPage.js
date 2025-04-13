import React, { useEffect, useState } from "react";
import { useShoppingCart } from "../utils/ShoppingCartProvider";
import { useNavigate } from "react-router-dom";
import axiosWithToken from "../utils/axiosWithToken";
import { Button } from "react-bootstrap";
import Footer from "../components/Footer";

function CashierOrderPage({ fetchMenu }) {

    //장바구니
    const { cartItems, totalPrice, setCartItems } = useShoppingCart();
    //리액트 라우터
    const navigate = useNavigate();

    //주문상태
    const [orderState, setOrderState] = useState("loading");
    const [saleId, setSaleId] = useState();

    //주문 로직
    useEffect(() => {

        //장바구니 없이 직접 /cashier-order로 접근시 리다이렉트
        if (!cartItems || cartItems.length === 0) {
            navigate("/", { replace: true });
            return;
        }

        //json 데이터 생성
        const orderData = {
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                totalAmount: (item.price * item.quantity),
            })),
            totalAmount: totalPrice,
            discountAmount: 0,
            finalAmount: totalPrice,
            payment: "QR_CASHIER"
        }

        //서버로 전송
        axiosWithToken.post("/order", orderData)
            .then((response) => {
                setOrderState("success");
                setSaleId(response.data)
            })
            .catch((error) => {
                setOrderState("fail");
            });

    }, []);


    if (!cartItems || cartItems.length === 0) return null;

    return (
        <div className="z-1 position-absolute top-0 start-0 w-100 h-100 bg-white">

            {/* 로딩 */}
            {orderState === "loading" &&
                <div className="d-flex flex-column h-100 align-items-center justify-content-center">
                    <div className="circle-loader" />
                    <div className="mt-3">주문 처리중입니다.</div>
                </div>
            }

            {/* 성공 */}
            {orderState === "success" &&
                <div className='d-flex flex-column h-100'>

                    {/* 로딩 서클 */}
                    <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
                        <div className="circle-loader load-complete">
                            <div className="checkmark draw"></div>
                        </div>
                        {/* 주문 성공 메시지 */}
                        <div className="mt-3 fs-1 fw-semibold">주문 번호 : #{saleId}</div>
                        <div className="mt-1">주문이 정상적으로 처리되었습니다.</div>
                    </div>

                    <Footer value={"홈으로"} show={true} onClick={() => {
                        //장바구니 초기화 
                        setCartItems([]);
                        //메뉴 초기화
                        fetchMenu();
                        //홈화면 이동
                        navigate(-2);
                    }}
                    />
                </div>
            }

            {/* 실패 */}
            {orderState === "fail" &&
                <div className='d-flex flex-column h-100'>

                    {/* 로딩 서클 */}
                    <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
                        <div className="circle-loader load-fail">
                            <div className="exclamation"></div>
                        </div>
                        {/* 주문 실패 메시지 */}
                        <div className="mt-3 fs-1 fw-semibold text-danger">주문 실패!</div>
                        <div className="mt-1">주문 처리에 실패했습니다. 관리자에게 문의하세요.</div>
                    </div>

                    <footer className="p-2 pb-3 border-top">
                        <Button variant="secondary" className="w-100 fs-5 fw-semibold p-2 rounded-3" onClick={() => navigate(-1)}>
                            뒤로가기
                        </Button>
                    </footer>
                </div>

            }

        </div>
    );
}

export default CashierOrderPage;