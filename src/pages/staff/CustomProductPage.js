import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader";
import { Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import { useShoppingCart } from "../../utils/ShoppingCartProvider";
import { useTost } from "../../utils/TostProvider";
import { v4 as uuidv4 } from 'uuid';


function CustomProductPage() {

    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useShoppingCart();
    const { showTost } = useTost();

    //인풋값
    const [name, setName] = useState(location.state?.itemName ?? "");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(price * quantity);
    }, [price, quantity]);

    //검증
    const [isInValidName, setIsInValidName] = useState(false);
    const [feedbackName, setFeedbackName] = useState();

    //추가버튼
    const submit = () => {

        //인풋 검증
        if (name.trim() === '') {
            setFeedbackName('상품명을 입력해주세요');
            setIsInValidName(true);
            return;
        }

        if (price <= 0 || quantity <= 0) {
            showTost("가격과 수량을 입력해주세요.");
            return;
        }

        addCart();
    }

    //장바구니 추가하는 로직
    const addCart = () => {

        // 기존 장바구니에서 현재 상품 있는지 확인
        const existingItemIndex = cartItems.findIndex(preItem => preItem.name === name.trim());

        //이미 존재시에
        if (existingItemIndex !== -1) {
            showTost("이미 장바구니에 존재하는 상품입니다.");
            return;
        }

        // 장바구니 업데이트
        setCartItems(prevItems => {

            // 새로 추가될 item 객체
            const newItem = {
                id: uuidv4(),
                name: name.trim(),
                price,
                quantity,
                stock: 10000, // 임의의 충분한 재고 (필요 시 제거 가능)
                description: '직접 추가한 상품',
                photo: '', // 기본값 설정
            };

            return [...prevItems, newItem];
        });

        showTost("장바구니 추가 완료");
        navigate(-1);
    };

    const nameChange = (e) => {
        setName(e.target.value);
        if (isInValidName) setIsInValidName(false);
    }

    const priceChange = (e) => {
        setPrice(Number(e.target.value.replace(/[^\d]/g, "")));
    }

    const quantityChange = (e) => {
        setQuantity(Number(e.target.value.replace(/[^\d]/g, "")));
    }


    return (
        <div className='d-flex flex-column h-100  bg-white'>

            <SubHeader title={"직접 입력하기"} />

            <div className='flex-grow-1 overflow-y-auto p-3'>

                <div>
                    <Form.Label className='fs-5 fw-medium text-success'>상품명</Form.Label>
                    <Form.Control size="lg" type="text" placeholder="상품명을 입력해주세요." value={name} onChange={nameChange} isInvalid={isInValidName} />
                    <Form.Control.Feedback type="invalid" className='text-start'>{feedbackName}</Form.Control.Feedback>
                </div>

                <div className='mt-3'>
                    <Form.Label className='fs-5 fw-medium  text-success'>단가</Form.Label>
                    <Form.Control size="lg" type="text" placeholder="가격을 입력해주세요." pattern="\d*" inputMode="numeric" value={price === 0 ? '' : price.toLocaleString('ko-KR')} onChange={priceChange} />
                </div>

                <div className='mt-3'>
                    <Form.Label className='fs-5 fw-medium  text-success'>수량</Form.Label>
                    <Form.Control size="lg" type="text" placeholder="수량을 입력해주세요." pattern="\d*" inputMode="numeric" value={quantity === 0 ? '' : quantity.toLocaleString('ko-KR')} onChange={quantityChange} />
                </div>
            </div>

            <Footer
                value={total > 0 ? `${total.toLocaleString('ko-KR')}원 · 추가하기` : "정보를 입력해주세요."}
                show={true}
                disabled={total <= 0}
                onClick={submit}
            />

        </div>
    );
}

export default CustomProductPage;