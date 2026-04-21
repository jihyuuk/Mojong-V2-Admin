import { useEffect, useState } from "react";
import LoadingContent from "../components/LoadingContent";
import SubHeader from "../components/SubHeader";
import { ListGroup } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import axiosWithToken from "../utils/axiosWithToken";


function QrOrdersPage() {

    //로딩
    const [isLoading, setIsLoading] = useState(true);

    // QR 주문 목록
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axiosWithToken.get("/qr-orders")
            .then((res) => {
                setOrders(res.data);
                setIsLoading(false);
            })
            .catch(() => {
                alert("QR 주문 목록을 불러오지 못하였습니다.")
            });
    }, []);



    return (
        <>
            <div className='d-flex flex-column h-100  bg-white'>

                <SubHeader title={"QR 주문 목록"} />

                {isLoading
                    ?
                    <LoadingContent />
                    :
                    <div className="flex-grow-1 overflow-y-auto pb-5">

                        {/* 기록 비어있나 확인 */}
                        {orders.length <= 0 ?
                            <div className="text-center fs-5 text-secondary" style={{ marginTop: "15rem" }}>
                                QR 주문이 없습니다.
                            </div>
                            :
                            <ListGroup variant='flush' className='border-top border-bottom'>
                                {orders.map((order, index) => (
                                    <Link key={index} to={`/qr-orders/${order.id}`} style={{ textDecoration: 'none' }}>
                                        <ListGroup.Item className="py-3 px-3 action-item"
                                            style={{
                                                // 테두리 색상 분기
                                                borderLeft: order.status === "ACCEPTED" ? '4px solid #adb5bd' : '4px solid #198754',
                                                // 확인된 항목은 약간 불투명하게 처리해서 시각적으로 뒤로 밀어냄
                                                opacity: order.status === "ACCEPTED" ? 0.7 : 1,
                                            }}
                                        >
                                            <div className='d-flex gap-3 justify-content-between align-items-center'>

                                                <div className="flex-grow-1">
                                                    {/* 주문 번호와 상태 배지 */}
                                                    <div className='d-flex align-items-center gap-2 mb-1'>
                                                        <span className='fw-bold text-success' style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
                                                            #{String(order.id).padStart(3, '0')}
                                                        </span>
                                                        {order.status === "ACCEPTED" ? (
                                                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-medium">완료</span>
                                                        ) : (
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle fw-medium">신규</span>
                                                        )}
                                                    </div>

                                                    {/* 제목 (품목명) */}
                                                    <div className='fw-bold text-dark mb-1' style={{ fontSize: '1.05rem' }}>
                                                        {order.title}
                                                    </div>

                                                    {/* 날짜/시간 */}
                                                    <div className='text-muted' style={{ fontSize: '0.85rem' }}>
                                                        <i className="bi bi-clock me-1"></i> {order.date}
                                                    </div>
                                                </div>

                                                {/* 우측 금액 */}
                                                <div className='fw-bold text-dark fs-5 text-nowrap'>
                                                    {order.totalAmount.toLocaleString('ko-KR')}원
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    </Link>
                                ))}
                            </ListGroup>
                        }



                        {/* {totalPage > 1 &&
                            <Pagination className='mt-4 justify-content-center gap-1 my-pagination'>

                                {startPage >= pageCount &&
                                    <Pagination.Prev onClick={() => fetchPage(startPage - 1, startDate, endDate)} />
                                }

                                {pageRange.map((page) => (
                                    <Pagination.Item
                                        key={page}
                                        active={page === nowPage}
                                        onClick={() => fetchPage(page, startDate, endDate)}
                                    >
                                        {page + 1}
                                    </Pagination.Item>
                                ))}

                                {endPage < totalPage - 1 &&
                                    <Pagination.Next onClick={() => fetchPage(endPage + 1, startDate, endDate)} />
                                }

                            </Pagination>
                        } */}
                    </div>
                }

            </div>

            <Outlet />
        </>
    );
}

export default QrOrdersPage;