import React, { useEffect, useState } from 'react';
import { useTost } from '../utils/TostProvider';
import SubHeader from '../components/SubHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../utils/ShoppingCartProvider';
import Footer from '../components/Footer';

function DetailPage() {

    //리액트 라우터
    const navigate = useNavigate();
    const location = useLocation();
    //state로 넘어온 item 꺼내오기
    const item = location.state;


    //토스트
    const { showTost } = useTost();
    //장바구니
    const { cartItems, setCartItems } = useShoppingCart();

    //수량
    const [quantity, setQuantity] = useState(0);
    //최대수량
    const maxQuantity = 9999;

    //가격
    const [total, setTotal] = useState(0);

    //수량 변화시 금액 변경
    useEffect(() => {
        if (!item) return;
        setTotal(item.price * quantity);
    }, [quantity])

    const addCart = () => {
        // 기존 장바구니에서 현재 상품 있는지 확인
        const existingItemIndex = cartItems.findIndex(preItem => preItem.id === item.id);
        const existingQuantity = existingItemIndex !== -1 ? cartItems[existingItemIndex].quantity : 0;
        const totalQuantity = existingQuantity + quantity;

        // 장바구니 업데이트
        setCartItems(prevItems => {
            if (existingItemIndex !== -1) {
                return prevItems.map((item, idx) =>
                    idx === existingItemIndex
                        ? { ...item, quantity: Math.min(totalQuantity, maxQuantity) }
                        : item
                );
            }
            return [...prevItems, { ...item, quantity }];
        });

        // 재고 초과 검증
        if (totalQuantity > item.stock) {
            const cartText = existingQuantity > 0 ? `, 장바구니: ${existingQuantity}개` : '';
            showTost(`재고 확인 필요! (재고: ${item.stock}개${cartText})`);
        } else {
            showTost("장바구니 추가 완료");
        }

        navigate(-1);
    };

    //넘버패드===========================================
    const numberPad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['C', '0', '⌫']
    ];
    const plusValue = [5, 10, 50, 72];

    const keyClicked = (value) => {
        //C버튼
        if (value === 'C') {
            setQuantity(0);
            return;
        }
        //지우기 버튼
        if (value === '⌫') {
            setQuantity(Math.floor(quantity / 10));
            return;
        }

        //숫자일때
        const newQuantity = quantity * 10 + Number(value);

        if (newQuantity > maxQuantity) {
            showTost("장난 치지 마시오!");
            return
        }
        setQuantity(newQuantity);
    }


    const plusButtonClick = (value) => {
        const newQuantity = quantity + Number(value);

        if (newQuantity > maxQuantity) {
            showTost("장난 치지 마시오!");
            return
        }
        setQuantity(newQuantity);
    }

    //상품 클릭 없이 직접 /detail로 접근시 리다이렉트
    useEffect(() => {
        if (!item) {
            navigate("/", { replace: true });
        }
    }, [item, navigate]);
    if (!item) return null;

    return (
        //애니메이션 적용 취소
        //<MotionPage>
        <div className='z-2 position-absolute top-0 start-0 w-100 h-100 bg-white'>
            <div className='d-flex flex-column h-100 bg-white'>

                {/* 헤더 */}
                <SubHeader title={item.name} />

                {/* 상품 정보*/}
                <div className='px-3'>
                    <div className='d-flex  w-100 mt-1'>
                        {/* 이름, 설명, 단가 */}
                        <div className='flex-grow-1 pe-2'>
                            <div className='text-secondary mt-1'>
                                {item.description}
                            </div>
                            <div className="text-success fw-semibold mt-1">
                                단가: ₩ {item.price.toLocaleString('ko-KR')}
                            </div>
                        </div>

                        {/* 사진 */}
                        {item.photo &&
                            <div>
                                <img src={item.photo} alt="상품 사진" className='rounded-3' style={{ width: '5rem' }} />
                            </div>
                        }
                    </div>
                </div>

                {/* 수량 */}
                <div className='flex-grow-1 overflow-y-auto'>
                    <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                        <div className='display-3 fw-semibold text-success'>{quantity.toLocaleString('ko-KR')}개</div>
                        <div className='mt-3 fw-medium text-secondary fs-5'>합계 {total.toLocaleString('ko-KR')}원</div>
                    </div>
                </div>

                {/* 넘버패드 */}
                <div className='mt-auto'>
                    <div className='d-flex gap-2 text-center fw-semibold text-success px-2 mb-1'>
                        {plusValue.map((value, index) =>
                            <div
                                key={index}
                                onClick={() => plusButtonClick(value)}
                                className='w-100 rounded-3 py-2 bg-success-subtle'
                                onTouchStart={(e) => {
                                    e.currentTarget.classList.remove('bg-success-subtle');
                                    e.currentTarget.classList.add('bg-secondary-subtle', 'text-secondary');
                                }}
                                onTouchEnd={(e) => {
                                    e.currentTarget.classList.remove('bg-secondary-subtle', 'text-secondary');
                                    e.currentTarget.classList.add('bg-success-subtle');
                                }}
                            >
                                +{value}
                            </div>
                        )}
                    </div>

                    {numberPad.map((row, rowIdx) =>
                        <div key={"row" + rowIdx} className='d-flex text-center fw-semibold fs-4'>
                            {row.map((number, colIdx) =>
                                <div
                                    key={"num" + colIdx}
                                    className='w-100 py-3 rounded-4 mb-1'
                                    onClick={() => keyClicked(number)}
                                    onTouchStart={(e) => e.currentTarget.classList.add('bg-secondary-subtle', 'text-secondary')}
                                    onTouchEnd={(e) => e.currentTarget.classList.remove('bg-secondary-subtle', 'text-secondary')}
                                >
                                    {number}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* 장바구니 담기 버튼 */}
                <Footer value={total > 0 ? '장바구니 담기' : '수량을 입력해주세요'} disabled={total <= 0} onClick={addCart} show={true} />
                
            </div>
        </div>
        //</MotionPage>
    );
}

export default DetailPage;