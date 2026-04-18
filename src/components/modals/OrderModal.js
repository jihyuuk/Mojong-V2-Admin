import React, { useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useShoppingCart } from "../../utils/ShoppingCartProvider";
import { useNavigate } from "react-router-dom";


function OrderModal({ showModal, setShowModal, finalAmount, payment, discountAmount }) {

    const { cartItems, totalPrice, totalQuantity } = useShoppingCart();

    const navigate = useNavigate();

    // 1. 출력 모드 상태 변경 (ALL: 전체, RECEIPT: 영수증만, NONE: 모두생략)
    //  초기 상태를 localStorage에서 가져오기 (없으면 'RECEIPT'가 기본값)
    const [printMode, setPrintMode] = useState(() => {
        return localStorage.getItem("lastPrintMode") || "RECEIPT";
    });

    // 2. 출력 모드가 바뀔 때마다 localStorage에 저장하기
    const handlePrintModeChange = (mode) => {
        setPrintMode(mode);
        localStorage.setItem("lastPrintMode", mode);
    };

    //주문항목 만드는 함수
    const getCartSummary = () => {
        if (!cartItems || cartItems.length === 0) return "주문 항목 없음";

        const firstName = cartItems[0].name;
        const restCount = cartItems.length - 1;

        return restCount > 0
            ? `${firstName} 외 ${restCount}개`
            : `${firstName}`;
    };


    //주문하기
    const sumbit = () => {

        //주문 데이터 생성
        const orderData = {
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                totalAmount: (item.price * item.quantity),
            })),
            totalAmount: totalPrice,
            discountAmount: discountAmount,
            finalAmount: finalAmount,
            payment: payment,
            skipReceipt: printMode === 'NONE',
            skipExchangeReceipt: printMode !== 'ALL'
        }

        // 주문 페이지로 이동
        navigate("/order", { state: { orderData } });
        //모달 닫기
        setShowModal(false);
    }


    return (
        <Modal show={showModal} animation={false} className="mt-5">
            <ModalHeader className='border-bottom border-success-subtle border-2'>
                <ModalTitle className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-receipt-cutoff text-success" viewBox="0 0 16 16">
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
                        <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z" />
                    </svg>
                    <div className='ms-2 fw-medium'>주문을 확인해주세요</div>
                </ModalTitle>
            </ModalHeader>

            <ModalBody className='fs-4'>

                <div className="text-secondary mb-3" style={{ fontSize: '1rem' }}>
                    <span >품목 {cartItems.length}</span>
                    <span > · 총 수량 {totalQuantity}</span>
                </div>

                <div className="border px-2 py-3 rounded-3 bg-body-tertiary">
                    <div className="mb-1">
                        <div className="text-muted small mb-1">주문 항목</div>
                        <div className="fs-5 fw-bold ps-1">{getCartSummary()}</div>
                    </div>

                    <div className="mb-3">
                        <div className="text-muted small mb-1">결제 방식</div>
                        <div className="ps-1 fw-semibold fs-5">{payment === "CASH" ? "현금 결제 💵" : "카드 결제 💳"}</div>
                    </div>


                    {discountAmount > 0 &&
                        <div className="mb-3">
                            <div className="text-muted small mb-1">할인 금액</div>
                            <div className="ps-1 fs-4 fw-semibold text-danger">-{discountAmount.toLocaleString()}원</div>
                        </div>
                    }

                    <div className="">
                        <div className="text-muted small mb-1">최종 결제 금액</div>
                        <div className="ps-1 fs-4 fw-semibold text-success">{finalAmount.toLocaleString()}원</div>
                    </div>
                </div>

                {/* 3. 출력 옵션 영역 수정 */}
                <div className="p-3 border rounded-3 bg-white mt-3">
                    <div className="d-flex flex-column gap-2 text-muted">
                        <Form.Check
                            type="radio"
                            id="print-receipt"
                            name="printOption"
                            label="영수증"
                            checked={printMode === 'RECEIPT'}
                            onChange={() => handlePrintModeChange('RECEIPT')}
                            className={printMode === 'RECEIPT' ? "fw-bold text-success" : ""}
                        />
                        <Form.Check
                            type="radio"
                            id="print-all"
                            name="printOption"
                            label="영수증 + 교환권"
                            checked={printMode === 'ALL'}
                            onChange={() => handlePrintModeChange('ALL')}
                            className={printMode === 'ALL' ? "fw-bold text-success" : ""}
                        />
                        <Form.Check
                            type="radio"
                            id="print-none"
                            name="printOption"
                            label="모두 생략"
                            checked={printMode === 'NONE'}
                            onChange={() => handlePrintModeChange('NONE')}
                            className={printMode === 'NONE' ? "fw-bold text-danger" : ""}
                        />
                    </div>
                </div>

            </ModalBody>

            <div className='d-flex gap-1 p-2 border-top'>
                <Button variant='secondary' className='fw-semibold py-2 text-nowrap px-5' onClick={() => setShowModal(false)} >취소</Button>
                <Button variant='success' className='w-100 fw-semibold py-2' onClick={sumbit} >주문</Button>
            </div>
        </Modal>
    )
}

export default OrderModal;