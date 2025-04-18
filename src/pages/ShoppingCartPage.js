import React, { useEffect, useRef, useState } from "react";
import { useTost } from "../utils/TostProvider";
import SubHeader from "../components/SubHeader";
import MotionPage from "../motions/MotionPage";
import Footer from "../components/Footer";
import { useShoppingCart } from "../utils/ShoppingCartProvider";
import ShoppingCartList from "../components/ShoppingCartList";
import ChangeAccordion from "../components/ChangeAccordion";
import DiscountAccordion from "../components/DiscountAccordion";
import OrderModal from "../components/modals/OrderModal";

function ShoppingCartPage() {

    //토스트
    const { showTost } = useTost();
    //장바구니
    const { cartItems, totalPrice, totalQuantity } = useShoppingCart();

    //할인관련
    const [finalAmount, setFinalAmount] = useState(totalPrice);
    const [discountAmount, setDiscountAmount] = useState(0);

    //할인 자동계산
    useEffect(() => {
        setFinalAmount(totalPrice - discountAmount);
    }, [discountAmount, totalPrice]);

    //결제 방식
    const [payment, setPayment] = useState();
    const paymentSectionRef = useRef(null);

    //주문확인 모달
    const [showModal, setShowModal] = useState(false);

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

        //모달 보여주기
        setShowModal(true);
    }

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

                    {/* 합계, 할인 */}
                    <div className="mt-3 bg-white p-3">
                        <div className="pb-3 fs-4 fw-semibold">합계</div>
                        <div className="border border-success-subtle rounded-3 p-3">

                            {discountAmount > 0 &&
                                <div>
                                    <div className='d-flex justify-content-between text-secondary'>
                                        <div>
                                            합계
                                        </div>
                                        <div>
                                            <div>{totalPrice.toLocaleString('ko-KR')}원</div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between mt-1'>
                                        <div className='text-secondary'>
                                            할인
                                        </div>
                                        <div className="text-danger">
                                            - {discountAmount.toLocaleString('ko-KR')}원
                                        </div>
                                    </div>

                                    <hr />
                                </div>
                            }

                            <div className=" d-flex justify-content-between fs-5 fw-medium fw-semibold ">
                                <div className="text-success">총 금액 :</div>
                                <div className={finalAmount > 0 ? "text-success" : "text-danger"}>{finalAmount.toLocaleString("ko-KR")}원</div>
                            </div>
                        </div>

                        <DiscountAccordion setDiscountAmount={setDiscountAmount} totalPrice={totalPrice} />
                    </div>


                    {/* 결제 방식 */}
                    <div className="bg-white mt-3 shadow-sm p-3" ref={paymentSectionRef}>
                        <div className="pb-3 fs-4 fw-semibold">결제 방식</div>

                        <div className="pb-2 text-center gap-2 d-flex fw-semibold">
                            <div className={payment === "CREDIT_CARD" ? "payment-on" : "payment-off"} onClick={() => setPayment("CREDIT_CARD")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-credit-card me-2" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                                <div className="mt-3 fs-6">카드 결제</div>
                            </div>
                            <div className={payment === "CASH" ? "payment-on" : "payment-off"} onClick={() => setPayment("CASH")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-coin py-2" viewBox="0 0 16 16">
                                    <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z" />
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                                </svg>
                                <div className="mt-3 fs-6">현금 결제</div>
                            </div>
                        </div>

                        {/* 선택 x */}
                        {!payment && <div className="text-danger ps-2">※ 결제 방식을 선택해주세요.</div>}
                        {/* 카드결제 선택 */}
                        {payment === "CREDIT_CARD" && <div className="ps-2">※ 카드 단말기로 결제해주세요.</div>}
                        {/* 현금결제 선택 */}
                        {payment === "CASH" && <ChangeAccordion finalAmount={finalAmount} />}

                        {/* 여백 */}
                        <div style={{ height: '9rem' }}></div>
                    </div>

                </main>


                {/* 푸터 */}
                <Footer
                    value={"주문하기"}
                    show={finalAmount > 0}
                    onClick={orderClick}
                >
                    <div className='pt-0 p-2 d-flex justify-content-between text-secondary'>
                        <div>품목 <span className='fw-semibold'>{cartItems.length}</span> · 수량 <span className='fw-semibold'>{totalQuantity}</span></div>
                        <div className='text-success'>총 합계 <span className='fw-semibold'>{finalAmount.toLocaleString('ko-KR')}</span>원</div>
                    </div>
                </Footer>

            </div>

            {/* 주문 확인 모달 */}
            <OrderModal
                showModal={showModal}
                setShowModal={setShowModal}
                discountAmount={discountAmount}
                finalAmount={finalAmount}
                payment={payment}
            />
        </MotionPage>
    )
}

export default ShoppingCartPage;