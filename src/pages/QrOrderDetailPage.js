import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ListGroup, ListGroupItem, Table } from 'react-bootstrap';
import SubHeader from '../components/SubHeader';
import MotionPage from '..//motions/MotionPage';
import axiosWithToken from "../utils/axiosWithToken"
import { useTost } from '../utils/TostProvider';
import LoadingContent from '../components/LoadingContent';
import SaleEditModal from '../components/modals/SaleEditModal';
import Footer from '../components/Footer';
import { useMenu } from '../utils/MenuProvider';
import { useShoppingCart } from '../utils/ShoppingCartProvider';

function QrOrderDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showTost } = useTost();

    const { fetchMenu } = useMenu();

    const { totalQuantity, setCartItems } = useShoppingCart();

    const [menu, setMenu] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);


    useEffect(() => {
        //하드코딩 /menu 두번 호출
        fetchMenu();

        //주문 상세 가져오기 
        axiosWithToken.get(`/qr-orders/${id}`)
            .then((response) => setOrderDetail(response.data))
            .catch(() => alert("주문 상세를 불러오지 못 했습니다."));

        //메뉴 세팅
        axiosWithToken.get('/menu')
            .then((response) => {
                setMenu(response.data);
            })
            .catch((error) => {
                alert("상품을 불러오지 못 했습니다");
            });
    }, [id]);


    // 2. 결제 진행 (장바구니 담기)
    const handleProceedToCart = () => {

        // 1. 장바구니 비우기 확인
        if (totalQuantity > 0 && !window.confirm("장바구니에 이미 상품이 담겨 있습니다.\n기존 내역을 모두 지우고 이 주문으로 교체하시겠습니까?")) {
            return;
        }

        // 2. 장바구니에 적용
        const updatedCart = orderDetail.items
            .map((item) => {
                const menuItem = menu.flatMap(c => c.items).find(i => i.id === item.id);

                if (menuItem) {
                    // 가격 변동 체크
                    if (item.price !== menuItem.price) {
                        alert(
                            `"${item.name}" 상품의 가격이 변동되었습니다.\n` +
                            `${item.price.toLocaleString()}원 => ${menuItem.price.toLocaleString()}원`
                        );
                    }
                    return { ...menuItem, quantity: item.quantity };
                } else {
                    // 상품 삭제 체크
                    alert(`"${item.name}" 상품이 현재 매장 메뉴에 존재하지 않아 제외합니다.`);
                    return null; // 없는 상품은 일단 null
                }
            })
            .filter(item => item !== null); // null(메뉴에 없는 것)은 제거

        // 만약 담을 상품이 하나도 없다면?
        if (updatedCart.length === 0) {
            alert("현재 판매 중인 상품이 없어 장바구니에 담을 수 없습니다.");
            return;
        }
        setCartItems(updatedCart);

        // 3. 확인 플래그 날리기
        axiosWithToken.patch(`/qr-orders/${id}/accept`)
            .then((response) => {
            })
            .catch((error) => {
                showTost("확인 플래그 실패");
            });

        // 4. 이동
        showTost("장바구니에 담겼습니다.");
        navigate("-2");
    };


    return (
        <MotionPage>
            <div className="d-flex flex-column h-100">

                <SubHeader title="QR 주문 상세" />

                {!menu || !orderDetail ?
                    <LoadingContent />
                    :
                    <>
                        <div className="flex-grow-1 overflow-y-auto pb-5">

                            <ListGroup className='fw-medium'>

                                {/* 판매내역 */}
                                <ListGroupItem>
                                    <div className='d-flex align-items-center gap-2 fw-semibold text-success fs-4 mb-1'>
                                        <span className='fw-bold text-success'>
                                            주문번호 #{String(orderDetail.id).padStart(3, '0')}
                                        </span>
                                        {orderDetail.status === "ACCEPTED" ? (
                                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-medium">완료</span>
                                        ) : (
                                            <span className="badge bg-success-subtle text-success border border-success-subtle fw-medium">신규</span>
                                        )}
                                    </div>

                                    <div className='ps-1 mb-4'>{orderDetail.date}</div>
                                    {/* 금액 부분 */}
                                    <div className='border border-success-subtle p-1 pb-3 rounded-3'>
                                        <Table responsive="md" className='mb-0'>
                                            <thead className='border-success-subtle'>
                                                <tr className='text-center'>
                                                    <th>상품명</th>
                                                    <th className='text-end'>수량</th>
                                                    <th className='text-end'>단가</th>
                                                    <th className='text-end'>금액</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orderDetail.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}. {item.name}</td>
                                                            <td className='text-end'> {item.quantity.toLocaleString('ko-KR')}</td>
                                                            <td className='text-end'> {item.price.toLocaleString('ko-KR')}</td>
                                                            <td className='text-end'> {item.totalAmount.toLocaleString('ko-KR')}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>


                                        <hr className='mt-1 border-success' />

                                        <div className="d-flex justify-content-between fw-semibold fs-4 px-2 pb-3">
                                            <div>
                                                총 금액
                                            </div>
                                            <div>
                                                {orderDetail.totalAmount.toLocaleString('ko-KR')}원
                                            </div>
                                        </div>

                                    </div>
                                </ListGroupItem>

                                {/* 주문 처리자 */}
                                {orderDetail.acceptedUsers && (
                                    <ListGroupItem>
                                        <div className='fw-semibold text-success fs-5 mb-2'>주문 담당자</div>
                                        <div className='ps-1'>{orderDetail.acceptedUsers}</div>
                                    </ListGroupItem>
                                )}

                            </ListGroup>

                        </div>

                        {/* 푸터 */}
                        <Footer
                            value="장바구니에 담기"
                            show={true}
                            onClick={handleProceedToCart}
                        />
                    </>
                }

            </div>
        </MotionPage>

        // <MotionPage>
        //     <div className="d-flex flex-column h-100 bg-light">
        //         <SubHeader title="QR 주문 상세 검증" />
        //         <div className="flex-grow-1 overflow-y-auto p-3 pb-5">
        //             <ListGroup className='shadow-sm rounded-4 overflow-hidden'>
        //                 <ListGroupItem className="p-4">
        //                     <div className='fw-bold text-success fs-4 mb-1'>주문번호 #{String(orderDetail.id).padStart(3, '0')}</div>
        //                     <div className='text-muted small mb-4'>{orderDetail.date}</div>

        //                     <div className='border rounded-3 overflow-hidden'>
        //                         <Table responsive className='mb-0 align-middle'>
        //                             <thead className='bg-light text-secondary small text-uppercase'>
        //                                 <tr>
        //                                     <th className="py-3 ps-3">상품명</th>
        //                                     <th className='text-end'>수량</th>
        //                                     <th className='text-end pe-3'>금액</th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 {orderDetail.items.map((item, index) => {
        //                                     const validation = validateItem(item);
        //                                     return (
        //                                         <React.Fragment key={index}>
        //                                             <tr className={validation ? 'table-danger' : ''}>
        //                                                 <td className="ps-3 py-3">
        //                                                     <div className="fw-bold">{item.name}</div>
        //                                                     <div className="text-muted small">{item.price.toLocaleString()}원</div>
        //                                                 </td>
        //                                                 <td className='text-end fw-bold'>{item.quantity}</td>
        //                                                 <td className='text-end pe-3 fw-bold'>{(item.price * item.quantity).toLocaleString()}원</td>
        //                                             </tr>
        //                                             {validation && (
        //                                                 <tr className="table-danger">
        //                                                     <td colSpan="3" className="py-1 ps-3 text-danger small fw-bold">
        //                                                         <i className="bi bi-exclamation-triangle-fill me-1"></i> {validation.error}
        //                                                     </td>
        //                                                 </tr>
        //                                             )}
        //                                         </React.Fragment>
        //                                     );
        //                                 })}
        //                             </tbody>
        //                         </Table>
        //                     </div>

        //                     <div className="mt-4 p-3 bg-success bg-opacity-10 rounded-3 d-flex justify-content-between align-items-center">
        //                         <span className="fw-bold text-success">총 합계 금액</span>
        //                         <span className="fs-3 fw-black text-success">{orderDetail.totalAmount.toLocaleString()}원</span>
        //                     </div>
        //                 </ListGroupItem>
        //             </ListGroup>
        //         </div>

        //         <Footer
        //             value="검증 확인 및 장바구니 담기"
        //             show={true}
        //             onClick={handleProceedToCart}
        //         />
        //     </div>
        // </MotionPage>
    );
}

export default QrOrderDetailPage;