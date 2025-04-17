import React from "react";
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import axiosWithToken from "../../utils/axiosWithToken";
import { useTost } from "../../utils/TostProvider";
import { useMenu } from "../../utils/MenuProvider";


function DeleteCategoryModal({ category, close }) {

    //메뉴 새로고침
    const { fetchMenu } = useMenu();

    //토스트
    const { showTost } = useTost();

    //카테고리 삭제
    const deleteCategory = () => {
        axiosWithToken.delete(`/category/${category.categoryId}`)
            .then((resopne) => {
                close();
                fetchMenu();
                showTost("카테고리 삭제 성공");
            })
            .catch((error) => {
                alert("카테고리 삭제 실패");
            })
    }


    //삭제모달
    return (
        <Modal show={true} style={{ paddingTop: '10rem' }} >
            <ModalHeader className='border-bottom border-success-subtle border-2'>
                <ModalTitle className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash3 text-danger" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                    <div className='ms-2 text-danger fw-semibold'>카테고리 삭제</div>
                </ModalTitle>
            </ModalHeader>

            <ModalBody className='text-center py-5 fs-4'>
                <div>
                    <div className='text-success fw-semibold pb-2'>{category.name}</div>
                    <div className='fw-medium'>정말 삭제하시겠습니까?</div>
                </div>
            </ModalBody>

            <div className='d-flex gap-1 p-2 border-top'>
                <Button variant='secondary' className='w-100' onClick={close} >닫기</Button>
                <Button variant='danger' className='w-100' onClick={deleteCategory}>삭제하기</Button>
            </div>
        </Modal>
    )
}

export default DeleteCategoryModal;