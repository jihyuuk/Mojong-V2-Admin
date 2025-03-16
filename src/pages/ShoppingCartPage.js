import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useTost } from "../utils/TostProvider";

function ShoppingCartPage({ close, cartItems, setCartItems, totalPrice, totalQuantity }) {

    //토스트
    const { showTost } = useTost();

    //삭제버튼
    const clickDelete = (deleteId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== deleteId));
        showTost("상품 제거 완료")
    }

    //수량 플러스
    const clickPlus = (plusId) => {
        setCartItems(prevItems => prevItems.map(
            item => {
                if (item.id !== plusId || item.quantity >= 999) {
                    return item;
                } else {
                    return { ...item, quantity: item.quantity + 1 };
                }
            }
        ))
    }

    //수량 마이너스
    const clickMinus = (minusId) => {
        setCartItems(prevItems => prevItems.map(
            item => {
                if (item.id !== minusId || item.quantity <= 1) {
                    return item;
                } else {
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
        ))
    }

    return (
        <div className="d-flex flex-column h-100">
            {/* 헤더 */}
            <header className='p-2 border-bottom border-success-subtle position-relative'>
                {/* 뒤로가기 버튼 */}
                <div className='p-1' onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    </svg>
                </div>

                <div className='fw-semibold fs-3 position-absolute top-50 start-50 translate-middle'>
                    장바구니
                </div>
            </header>

            {
                cartItems.length <= 0 ?

                    <div className='h-100 d-flex align-items-center text-center justify-content-center bg-secondary-subtle'>
                        <div className="fs-3 text-secondary mb-5">
                            <div className='mb-4'>비어있습니다</div>
                            <span className='border border-success-subtle rounded-5 fs-6 px-3 py-2 bg-light-subtle'>
                                + 직접입력
                            </span>
                        </div>
                    </div>
                    :
                    <>
                        {/* 메인 */}
                        <main className='my-content overflow-y-auto flex-grow-1 bg-secondary-subtle'>
                            {cartItems.map((item, index) => {
                                return (
                                    <ListGroup variant='flush' className='bg-white border'>

                                        {/* 카테고리의 아이템들 출력 부분*/}

                                        <ListGroup.Item className='fs-6 fw-medium py-2 px-3'>

                                            <div className='py-1'>
                                                {/* 헤더 */}
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    {/* 상품명 */}
                                                    <span className='fs-5 fw-semibold text-success me-2'>{index + 1}. {item.name}</span>
                                                    {/* 닫기버튼 */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" onClick={() => clickDelete(item.id)} >
                                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                                    </svg>
                                                </div>

                                                {/* 계산 */}
                                                <div className='d-flex justify-content-between align-items-end'>

                                                    {/* 수량버튼 */}
                                                    <span className='border border-success-subtle rounded-3 p-2 ms-3'>
                                                        {/* 빼기 */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-dash ${item.quantity <= 1 ? 'text-secondary' : ''}`} viewBox="0 0 16 16" onClick={() => clickMinus(item.id)} >
                                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                                        </svg>
                                                        {/* 수량 */}
                                                        <span className='mx-3'>{item.quantity}</span>
                                                        {/* 더하기 */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-plus ${item.quantity >= 999 ? 'text-secondary' : ''}`} viewBox="0 0 16 16" onClick={() => clickPlus(item.id)}>
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                        </svg>
                                                    </span>

                                                    <div className='pt-2'>
                                                        {/* 단가 */}
                                                        <div className='text-secondary text-end'>단가 {item.price.toLocaleString('ko-KR')}원</div>
                                                        {/* 합계 */}
                                                        <div className='' style={{ fontSize: '1.15rem' }}>합계 <span className='fw-semibold'>{(item.price * item.quantity).toLocaleString('ko-KR')}</span>원</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </ListGroup.Item>

                                    </ListGroup>

                                )
                            })}


                            <div className='py-2 fs-5 text-secondary text-center bg-white'>
                                + 직접입력하기
                            </div>

                            {/* 여백 */}
                            <div className="h-50"></div>
                        </main>


                        {/* 푸터 */}
                        <footer className='pb-3'>
                            <div className='w-100 p-2 pt-0' >
                                <div className='p-2 d-flex justify-content-between text-secondary'>
                                    <div>품목 <span className='fw-semibold'>{cartItems.length}</span> · 수량 <span className='fw-semibold'>{totalQuantity}</span></div>
                                    <div className='text-success'>총 합계 <span className='fw-semibold'>{totalPrice.toLocaleString('ko-KR')}</span>원</div>
                                </div>
                                <Button variant="success" className="fs-5 p-2 px-3 rounded-3 w-100 fw-semibold" disabled={totalPrice <= 0 ? true : false}>
                                    <div className=''>주문하기</div>
                                </Button>
                            </div>
                        </footer>

                    </>
            }




        </div>
    )
}

export default ShoppingCartPage;