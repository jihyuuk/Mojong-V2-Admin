import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import axiosWithToken from "../../utils/axiosWithToken";
import { useShoppingCart } from "../../utils/ShoppingCartProvider";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../utils/MenuProvider";

function SaleEditModal({ id, showEditModal, setShowEditModal }) {

    //메뉴
    const { menu } = useMenu();
    //장바구니
    const { setCartItems } = useShoppingCart();
    //라우터
    const navigate = useNavigate();
    //로딩체크
    const [isLoading, setIsLoading] = useState(false);
    //주문 수정 서버요청 결과
    const [success, setSuccess] = useState(false);

    const submit = () => {

        setIsLoading(true);
        setSuccess(false);

        //서버에 취소 요청 (서버에서 취소후 리턴값으로 상품 넘겨줌)
        axiosWithToken.post(`/order/${id}/edit`)
            .then((response) => {
                //장바구니에 상품 넣기(최신 가격으로 업데이트)
                const updatedCart = response.data.map((item) => {
                    const menuItem = menu.flatMap(category => category.items).find(menuItem => menuItem.id.toString() === item.id);

                    if (menuItem) {
                        //메뉴에 있으면 수량만 적용 <= 그래야 업데이트된 가격,설명 적용가능
                        return { ...menuItem, quantity: item.quantity }
                    } else {
                        // 메뉴에 없으면(커스텀 아이템) 그대로 사용
                        return item;
                    }

                });

                //적용하기
                setCartItems(updatedCart);

                //결과 보여주기(모달 변경)
                setSuccess(true);
            })
            .catch((error) => {
                setSuccess(false);
                if (error.response?.status === 400) {
                    alert(error.response.data);
                } else {
                    alert("주문 수정 실패");
                }
            })
            .finally(() => {
                setIsLoading(false);
            })


    }

    return (
        <Modal show={showEditModal} style={{ paddingTop: '10rem' }} >
            <ModalHeader className='border-bottom border-success-subtle border-2'>
                <ModalTitle className="w-100 text-center text-success fw-semibold fs-2">
                    {success ? "수정 요청 성공!" : "주문을 수정하시겠습니까?"}
                </ModalTitle>
            </ModalHeader>

            <ModalBody className='fs-4 py-4 text-center'>
                {success ?
                    <>
                        <div className="mb-2">해당 주문을 다시 <span className="fw-semibold">장바구니</span>에 담았습니다.</div>
                        <div className="pb-2">수정 후 <span className="fw-semibold">재주문</span>해주세요..</div>
                    </>
                    :
                    <div className="py-3">해당 주문은 <span className="fw-semibold text-danger">취소</span>됩니다.</div>
                }

            </ModalBody>

            <div className='d-flex gap-1 p-2 border-top'>
                {success ?
                    <Button variant='success' disabled={isLoading} className='w-100 fw-semibold py-2' onClick={() => navigate(-2)} >홈으로</Button>
                    :
                    <>
                        <Button variant='secondary' disabled={isLoading} className='fw-semibold py-2 text-nowrap px-5' onClick={() => setShowEditModal(false)} >취소</Button>
                        <Button variant='success' disabled={isLoading} className='w-100 fw-semibold py-2' onClick={submit} >수정하기</Button>
                    </>
                }
            </div>
        </Modal>
    )
}

export default SaleEditModal;