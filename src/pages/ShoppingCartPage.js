import React, { useRef, useState } from "react";
import { useTost } from "../utils/TostProvider";
import SubHeader from "../components/SubHeader";
import MotionPage from "../motions/MotionPage";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useShoppingCart } from "../utils/ShoppingCartProvider";
import ShoppingCartList from "../components/ShoppingCartList";

function ShoppingCartPage() {

    //리액트 라우터
    const navigate = useNavigate();

    //토스트
    const { showTost } = useTost();
    //장바구니
    const { cartItems, totalPrice, totalQuantity } = useShoppingCart();

    //결제 방식
    const [payment, setPayment] = useState();
    const paymentSectionRef = useRef(null);


    //주문버튼 클릭
    const orderClick = () => {
        //결제 방식 선택 안 했을때
        if (!payment) {
            showTost("결제 방식을 선택해주세요.");

            paymentSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }
        //직원결제
        if (payment === "QR_CASHIER") {
            navigate("/cashier-order");
            return;
        }
        //토스결제
        if (payment === "QR_SELF") {
            navigate("/self-order");
            return;
        }
    }


    //장바구니가 비었는데 직접 /shoppingcart로 접근시에 리다이렉트
    // useEffect(() => {
    //     if (!cartItems || cartItems.length === 0) {
    //         navigate("/", { replace: true });
    //     }
    // }, []);

    if (!cartItems || cartItems.length === 0) return null;

    return (
        <MotionPage> {/* 에니메이션 적용 */}
            <div className="d-flex flex-column h-100">
                {/* 헤더 */}
                <SubHeader title={"장바구니"} />

                {/* 메인 */}
                <main className='my-content overflow-y-auto flex-grow-1 bg-secondary-subtle'>

                    {/* 주문상품 */}
                    <div className="bg-white p-3 shadow-sm">
                        <div className="pb-3 fs-4 fw-semibold">주문 상품</div>
                        <ShoppingCartList />
                    </div>


                    {/* 합계 */}
                    <div className="mt-3 bg-white shadow-sm p-3">
                        <div className="pb-3 fs-4 fw-semibold">합계</div>
                        <div className="border border-success-subtle rounded-3">
                            <div className=" d-flex justify-content-between p-3 fs-5 fw-medium">
                                <div>총 금액 :</div>
                                <div className="fw-semibold text-success">{totalPrice.toLocaleString("ko-KR")}원</div>
                            </div>
                        </div>
                    </div>


                    {/* 결제 방식 */}
                    <div className="bg-white mt-3 shadow-sm p-3" ref={paymentSectionRef}>
                        <div className="pb-3 fs-4 fw-semibold">결제 방식</div>

                        <div className="pb-2 text-center gap-2 d-flex fw-semibold">
                            <div className={payment === "QR_CASHIER" ? "payment-on" : "payment-off"} onClick={() => setPayment("QR_CASHIER")}>
                                <img alt="직원에게 결제" src={payment === "QR_CASHIER" ? "/cashier_on.png" : "/cashier_off.png"} style={{ width: '100px', height: '100px' }} />
                                <div className="mt-3 fs-6">직원에게 결제</div>
                            </div>
                            <div className={payment === "QR_SELF" ? "payment-on" : "payment-off"} onClick={() => setPayment("QR_SELF")}>
                                <img alt="셀프결제" src={payment === "QR_SELF" ? "/self_on.png" : "/self_off.png"} style={{ width: '100px', height: '100px', marginRight: '30px' }} />
                                <div className="mt-3 fs-6">셀프 결제</div>
                            </div>
                        </div>

                        {/* 선택 x */}
                        {!payment && <div className="text-danger ps-2">※ 결제 방식을 선택해주세요.</div>}
                        {/* 직원결제 선택 */}
                        {payment === "QR_CASHIER" && <div className="ps-2">※ 직원에게 결제하고 수령하는 방식입니다.</div>}
                        {/* 셀프결제 선택 */}
                        {payment === "QR_SELF" && <div className="ps-2">※ 직원 없이 직접 결제하고 수령하는 방식입니다.</div>}

                        {/* 여백 */}
                        <div style={{ height: '4rem' }}></div>
                    </div>

                </main>


                {/* 푸터 */}
                <Footer
                    value={"주문하기"}
                    show={totalPrice > 0}
                    onClick={orderClick}
                >
                    <div className='pt-0 p-2 d-flex justify-content-between text-secondary'>
                        <div>품목 <span className='fw-semibold'>{cartItems.length}</span> · 수량 <span className='fw-semibold'>{totalQuantity}</span></div>
                        <div className='text-success'>총 합계 <span className='fw-semibold'>{totalPrice.toLocaleString('ko-KR')}</span>원</div>
                    </div>
                </Footer>

            </div>
        </MotionPage>
    )
}

export default ShoppingCartPage;