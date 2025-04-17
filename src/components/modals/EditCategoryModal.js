import React, { useState } from "react";
import { Button, FormControl, FormLabel, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTost } from "../../utils/TostProvider";
import axiosWithToken from "../../utils/axiosWithToken";
import { useMenu } from "../../utils/MenuProvider";


function EditCategoryModal({ category, close }) {

    //메뉴 새로고침
    const { fetchMenu } = useMenu();

    //토스트
    const { showTost } = useTost();

    //인풋 검증
    const [invalid, setInvaild] = useState(false);
    const [msg, setMsg] = useState('')

    //인풋
    const [inputValue, setInputValue] = useState(category.name);
    const changeInput = (value) => {
        setInvaild(false);
        setInputValue(value);
    }


    //카테고리 수정
    const editCategory = () => {

        setInputValue(prev => prev.trim());

        if (!inputValue.trim()) {
            setInvaild(true);
            setMsg('값을 입력해주세요.');
            return;
        }
        if (inputValue.trim() === category.name) {
            setInvaild(true);
            setMsg('변경된 내용이 없습니다.');
            return;
        }

        axiosWithToken.put(`/category/${category.categoryId}`, inputValue.trim(), { headers: { 'Content-Type': 'text/plain' } })
            .then((resopne) => {
                close();
                fetchMenu();
                showTost("카테고리 수정 성공");
            })
            .catch((error) => {
                //카테고리명 중복시
                if (error.response && error.response.status === 409) {
                    setInvaild(true);
                    setMsg('중복된 카테고리명 입니다.')
                    return;
                }

                alert("카테고리 수정 실패");
            })

    }


    return (
        <Modal show={true} style={{ paddingTop: '10rem' }} >
            <ModalHeader className='border-bottom border-success-subtle border-2'>
                <ModalTitle className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square text-success" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                    <div className='ms-2 fw-medium'>카테고리 편집</div>
                </ModalTitle>
            </ModalHeader>

            <ModalBody className='py-5 fs-4'>
                <FormLabel className='fw-medium pb-3 fs-5'>카테고리 : <span className='text-success'>{category.name}</span></FormLabel>
                <FormControl className='mb-3 fs-5' value={inputValue} onChange={(e) => changeInput(e.target.value)} isInvalid={invalid}></FormControl>
                <FormControl.Feedback type="invalid">{msg}</FormControl.Feedback>
            </ModalBody>

            <div className='d-flex gap-1 p-2 border-top'>
                <Button variant='secondary' className='w-100' onClick={close} >닫기</Button>
                <Button variant='success' className='w-100' onClick={editCategory}>수정하기</Button>
            </div>
        </Modal>
    )
}

export default EditCategoryModal;