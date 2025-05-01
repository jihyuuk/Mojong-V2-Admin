import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ListGroup, ListGroupItem, Table } from 'react-bootstrap';
import SubHeader from '../../components/SubHeader';
import MotionPage from '../../motions/MotionPage';
import axiosWithToken from "../../utils/axiosWithToken"
import { useTost } from '../../utils/TostProvider';
import LoadingContent from '../../components/LoadingContent';
import SaleEditModal from '../../components/modals/SaleEditModal';

function HistoryDetailPage() {

    const { id } = useParams();
    const { showTost } = useTost();

    //판매상세 
    const [saleDetail, setSaleDetail] = useState();

    //영수증 출력
    const [printLoading, setPrintLoading] = useState(false);

    //수정관련 모달
    const [showEditModal, setShowEditModal] = useState(false);


    //서버 연동
    useEffect(() => {
        axiosWithToken.get(`/history/${id}`)
            .then((response) => {
                setSaleDetail(response.data);
            })
            .catch(() => {
                alert("판매상세를 불러오지 못하였습니다.")
            });

    }, []);

    //영수증 인쇄하기
    const handlePrint = () => {

        //로딩
        setPrintLoading(true);

        //서버로직
        axiosWithToken.post(`/print/${id}`)
            .then((response) => {

                if (response.data.printOK) {
                    showTost("인쇄 성공!");
                } else {
                    showTost("인쇄 실패!");
                }
                setPrintLoading(false);
            })
            .catch(() => {
                showTost("인쇄 실패!");
                setPrintLoading(false);
            });
    }

    //주문 수정 아이콘클릭
    const onIconClick = () => {
        if (!saleDetail) return;

        if (saleDetail.isCanceled) {
            alert("이미 취소된 주문입니다.");
            return;
        }

        //주문 날짜 파싱
        //"2025.05.01 22:35" 형식을 Date 객체로 파싱
        const [datePart] = saleDetail.date.split(' ');
        const [year, month, day] = datePart.split('.').map(Number);
        const saleDate = new Date(year, month - 1, day); // 월은 0부터 시작

        //오늘
        const today = new Date();

        //같은 날인지 검증
        const isSameDate =
            today.getFullYear() === saleDate.getFullYear() &&
            today.getMonth() === saleDate.getMonth() &&
            today.getDate() === saleDate.getDate();

        if (!isSameDate) {
            alert("수정은 당일에만 가능합니다.");
            return;
        }

        setShowEditModal(true);
    };


    return (
        <MotionPage>
            <div className="d-flex flex-column h-100">

                <SubHeader
                    title={"판매 상세"}
                    onIconClick={onIconClick}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    }
                />

                {!saleDetail ?
                    <LoadingContent />
                    :
                    <div className="flex-grow-1 overflow-y-auto pb-5">

                        <ListGroup className='fw-medium'>

                            {/* 판매내역 */}
                            <ListGroupItem>
                                <div className='fw-semibold text-success fs-4 mb-2'>판매번호 #{saleDetail.id} {saleDetail.isCanceled && <span className='text-danger'>(취소됨)</span>}</div>

                                {/* 금액 부분 */}
                                <div className='border border-success-subtle p-1 rounded-3'>
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
                                                saleDetail.items.map((item, index) => (
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

                                    {saleDetail.discountAmount > 0 &&
                                        <div className='p-2 border-top'>
                                            <div className='d-flex justify-content-between'>
                                                <div className='text-secondary'>
                                                    합계금액
                                                </div>
                                                <div>
                                                    <div>{saleDetail.totalAmount.toLocaleString('ko-KR')}원</div>
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between mt-1'>
                                                <div className='text-secondary'>
                                                    할인
                                                </div>
                                                <div className={`${saleDetail.discountAmount > 0 ? 'text-danger' : 'text-secondary'}`}>
                                                    -{saleDetail.discountAmount.toLocaleString('ko-KR')}원
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <hr className='mt-1 border-success' />

                                    <div className="d-flex justify-content-between fw-semibold fs-4 px-2 pb-3">
                                        <div>
                                            총 금액
                                        </div>
                                        <div>
                                            {saleDetail.finalAmount.toLocaleString('ko-KR')}원
                                        </div>
                                    </div>

                                </div>
                            </ListGroupItem>



                            {/* 결제일시 */}
                            <ListGroupItem>
                                <div className='fw-semibold text-success fs-5 mb-2'>결제일시</div>
                                <div className='ps-1'>{saleDetail.date}</div>
                            </ListGroupItem>

                            {/* 판매자 */}
                            <ListGroupItem>
                                <div className='fw-semibold text-success fs-5 mb-2'>판매자</div>
                                <div className='ps-1'>{saleDetail.username}</div>
                            </ListGroupItem>

                            {/* 결제수단 */}
                            <ListGroupItem>
                                <div className='fw-semibold text-success fs-5 mb-2'>결제수단</div>
                                {/* 여기 수정 필요 */}
                                <div className='ps-1'>{saleDetail.payment === 'CASH' ? '💵 현금 결제' : '💳 카드 결제'}</div>
                            </ListGroupItem>
                        </ListGroup>
                        <div className='text-center py-4 bg-white'>
                            <Button variant='outline-success' className='fw-semibold fs-5 py-2 px-5 rounded-5' disabled={printLoading} onClick={handlePrint}>
                                {printLoading ?
                                    <>
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span role="status" className='ms-2'>출력중...</span>
                                    </>
                                    :
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-printer me-2" viewBox="0 0 16 16">
                                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                                        </svg>
                                        인쇄하기
                                    </>
                                }
                            </Button>
                        </div>
                    </div>
                }

            </div>

            {/* 수정 모달 (우상단 아이콘) */}
            <SaleEditModal id={id} showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
        </MotionPage>
    );
}

export default HistoryDetailPage;