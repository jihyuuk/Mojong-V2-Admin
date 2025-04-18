import React, { useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useShoppingCart } from "../../utils/ShoppingCartProvider";
import { useNavigate } from "react-router-dom";


function OrderModal({ showModal, setShowModal, finalAmount, payment, discountAmount }) {

    const { cartItems, totalPrice, totalQuantity } = useShoppingCart();

    const navigate = useNavigate();

    //주문항목 만드는 함수
    const getCartSummary = () => {
        if (!cartItems || cartItems.length === 0) return "주문 항목 없음";

        const firstName = cartItems[0].name;
        const restCount = cartItems.length - 1;

        return restCount > 0
            ? `${firstName} 외 ${restCount}개`
            : `${firstName}`;
    };

    //영수증 출력 여부
    const [skipReceipt, setSkipReceipt] = useState(false);

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
            skipReceipt: skipReceipt
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
                    <div className='ms-2 fw-medium'>주문확인</div>
                </ModalTitle>
            </ModalHeader>

            <ModalBody className='fs-4'>
                <div className="mb-2">
                    <div className="text-muted small mb-1">주문 항목</div>
                    <div className="fs-5 fw-bold ps-1">{getCartSummary()}</div>
                </div>

                <div className="mb-1">
                    <div className="text-muted small mb-1">품목 수</div>
                    <div className="ps-1" style={{ fontSize: '1rem' }}>{cartItems.length}개</div>
                </div>

                <div className="mb-3">
                    <div className="text-muted small mb-1">총 수량</div>
                    <div className="ps-1" style={{ fontSize: '1rem' }}>{totalQuantity}개</div>
                </div>

                <div className="mb-3">
                    <div className="text-muted small mb-1">최종 결제 금액</div>
                    <div className="ps-1 fs-4 fw-bold text-success">{finalAmount.toLocaleString()}원</div>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <Form.Check
                        className={skipReceipt ? "text-success" : "text-secondary"}
                        type="checkbox"
                        id="receipt-toggle"
                        label="영수증 생략하기"
                        checked={skipReceipt}
                        onChange={(e) => setSkipReceipt(e.target.checked)}
                    />
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