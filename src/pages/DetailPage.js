import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTost } from '../utils/TostProvider';

function DetailPage({ item, close, setCartItems }) {

    //토스트
    const { showTost } = useTost();

    //재고
    const stock = item.quantity;
    //수량
    const [quantity, setQuantity] = useState(0);
    //최대수량
    const maxQuantity = 999;

    //가격
    const [total, setTotal] = useState(0);

    //수량
    const inputRef = useRef(null);

    //수량 변화시 금액 변경
    useEffect(() => {
        setTotal(item.price * quantity);
    }, [quantity])


    //마이너스 버튼 클릭
    const clickMinus = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    }

    //플러스 버튼 클릭
    const clickPlus = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    }

    //수량 직접 입력
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            setQuantity(parseInt(quantity / 10));
        } else {
            const cal = quantity * 10 + parseInt(e.key);
            if (cal <= maxQuantity) {
                setQuantity(cal)
            }
        }
    };

    const addCart = () => {
        setCartItems(prevItems => {
            // 이미 장바구니에 같은 상품이 있는지 확인
            const existingItemIndex = prevItems.findIndex(preItem => preItem.id === item.id);

            // 이미 있는 상품이면 수량만 증가
            if (existingItemIndex !== -1) {
                return prevItems.map((item, idx) =>
                    idx === existingItemIndex
                        ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) } //최대 3자리 초과 막기
                        : item
                );
            }

            // 없는 상품이면 새로 추가
            return [...prevItems, { ...item, quantity: quantity }];
        });
        showTost("장바구니 추가 완료");
        close(); // 상세페이지 닫기
    };

    return (
        <div className='d-flex flex-column h-100 bg-white'>

            {/* 헤더 */}
            <header className='p-2 border-bottom border-success-subtle position-relative'>
                {/* 뒤로가기 버튼 */}
                <div className='p-1' onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    </svg>
                </div>

                <div className='fw-semibold fs-3 position-absolute top-50 start-50 translate-middle'>
                    상품 상세
                </div>
            </header>


            {/* 메인 */}
            <main className='flex-grow-1 overflow-y-auto px-0 pt-0'>
                {/* 사진 */}
                <div className='w-100' style={{height:'10rem', overflow:'hidden'}}>
                    <img src={item.photo} className='w-100 h-100'  style={{objectFit: 'cover'}}/>
                </div>

                <div className='p-3'>
                    <div className='fw-bold fs-1'>{item.name}</div>
                    <div className='py-3 text-secondary'>{item.description}</div>

                    <div className='mt-3 fw-semibold fs-5 d-flex justify-content-between'>
                        <div>
                            가격
                        </div>
                        <div>
                            {item.price.toLocaleString('ko-KR')}원
                        </div>
                    </div>

                    <div className='mt-3 fw-semibold fs-5 d-flex justify-content-between align-items-center flex-wrap'>
                        <div>
                            수량
                        </div>
                        {/* 수량 입력칸 */}
                        <div className="border rounded-3 d-flex align-items-center">
                            <span className={`px-3 py-2 ${quantity < 1 ? 'text-secondary' : ''}`} onClick={clickMinus}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                                </svg>
                            </span>

                            <input type="text" size={3} pattern="[0-9]*" inputMode="numeric"
                                ref={inputRef}
                                className="text-center border-0"
                                value={quantity === 0 ? '' : quantity}
                                placeholder='0'
                                onKeyDown={handleKeyDown}
                                style={{ caretColor: 'transparent' }}
                            />

                            <span className={`px-3 py-2 ${quantity >= maxQuantity ? 'text-secondary' : ''}`} onClick={clickPlus}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* 푸터 */}
            <footer className='pb-3'>
                <div className='p-2 border-top'>
                    <Button variant='success' className='w-100 fw-semibold fs-4 py-2' disabled={total <= 0 ? true : false} onClick={addCart}>
                        {total <= 0 ? '수량을 입력해주세요.' : total.toLocaleString('ko-KR') + '원 담기'}
                    </Button>
                </div>
            </footer>
        </div >
    );
}

export default DetailPage;